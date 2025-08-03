const openaiService = require('../services/openaiService');
const llamaService = require('../services/llamaService');
const pool = require('../db'); 


const sendMessage = async (req, res) => {
  try {
    const { message, subjectId, model = 'openai', history } = req.body;
    
    let messages = [
      { 
        role: 'system', 
        content: 'You are a helpful AI assistant. Always maintain context from previous messages in the conversation. When asked follow-up questions, refer to the previous context and provide relevant, contextual responses.'
      }
    ];

    if (history && Array.isArray(history) && history.length > 0) {
      messages = [...messages, ...history];
    }
    
    messages.push({ role: 'user', content: message });
    
    if (messages.length > 21) {
      const systemMessage = messages[0];
      const conversationMessages = messages.slice(1, -1);
      const currentMessage = messages[messages.length - 1];
      messages = [systemMessage, ...conversationMessages.slice(-19), currentMessage];
    }
    
    let response;
    if (model === 'llama') {
      response = await llamaService.generateChatResponse(messages);
    } else {
      response = await openaiService.generateChatResponse(messages);
    }
    const result = {
      success: true,
      data: {
        userMessage: message,
        aiResponse: response.content,
        timestamp: new Date().toISOString(),
        subjectId: subjectId || null,
        tokensUsed: response.tokensUsed,
        model: model
      }
    };
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response'
    });
  }
};

const generateQuizFromHistory = async (req, res) => {
  try {
    const { user_id, subject, model = 'openai', questionCount = 10, difficulty = 'medium', userProfile = {} } = req.body;
    
    let adaptiveDifficulty = difficulty;
    if (userProfile.educationLevel && userProfile.age) {
      if (userProfile.educationLevel === 'Elementary' || userProfile.age < 12) {
        adaptiveDifficulty = 'easy';
      } else if (userProfile.educationLevel === 'PhD' || userProfile.age > 25) {
        adaptiveDifficulty = 'hard';
      } else {
        adaptiveDifficulty = 'medium';
      }
    }
    
    const chatResult = await pool.query(
      'SELECT * FROM chats WHERE user_id = $1 AND subject = $2 ORDER BY created_at DESC LIMIT 1',
      [user_id, subject]
    );
    
    let quizData;
    
    const generateSubjectQuiz = async () => {
      const randomSeed = Math.floor(Math.random() * 1000);
      const focusAreas = [
        'key concepts and fundamentals',
        'practical applications and real-world examples',
        'common misconceptions and tricky areas',
        'advanced topics and deeper understanding',
        'problem-solving and critical thinking',
        'terminology and definitions',
        'step-by-step processes and methods',
        'comparisons and contrasts between concepts'
      ];
      
      const numFocusAreas = Math.floor(Math.random() * 2) + 2; 
      const shuffledAreas = [...focusAreas].sort(() => 0.5 - Math.random());
      const selectedFocusAreas = shuffledAreas.slice(0, numFocusAreas);
      const selectedFocus = selectedFocusAreas.join(', ');
      
      const subjectContent = `You are an expert ${subject} tutor. Generate a comprehensive quiz with ${questionCount} questions about ${subject} topics.

        SUBJECT: ${subject.toUpperCase()}
        IMPORTANT: All questions must be about ${subject} topics only. Do NOT include questions about other subjects.

        Student Profile:
        - Age: ${userProfile.age || 18}
        - Education Level: ${userProfile.educationLevel || 'High School'}
        - Learning Goals: ${userProfile.learningGoals || 'General learning'}

        Instructions:
        - Generate questions ONLY about ${subject} topics and concepts
        - Focus on ${subject}-specific terminology, skills, and fundamental concepts
        - Create questions appropriate for a ${userProfile.educationLevel || 'High School'} student
        - Use vocabulary and concepts appropriate for age ${userProfile.age || 18}
        - IMPORTANT: Only generate multiple choice questions (with 4 options) and true/false questions
        - Do NOT generate short answer questions
        - For multiple choice questions, provide 4 distinct options without prefixes like "Option A", "Option B", etc.
        - Provide clear explanations for correct answers
        - Ensure questions test understanding of ${subject} fundamentals and key concepts appropriate for the student's education level
        - Generate questions that match the complexity and depth expected for ${userProfile.educationLevel || 'High School'} students
        - CRITICAL: Focus on ${selectedFocus} to ensure variety from previous quizzes
        - Distribute questions across the selected focus areas: ${selectedFocusAreas.join(', ')}
        - Use different question formats, wording, and approaches than typical quiz questions
        - Random seed: ${randomSeed} - use this to ensure unique question generation

        Format the response as JSON:
        {
          "title": "${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz",
          "description": "Test your knowledge of ${subject} fundamentals and key concepts.",
          "questions": [
            {
              "question": "Question text",
              "type": "multiple-choice",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": "Option A",
              "explanation": "Explanation of why this answer is correct"
            },
            {
              "question": "True or False: Statement here",
              "type": "true-false",
              "correctAnswer": "True",
              "explanation": "Explanation of why this answer is correct"
            }
          ]
        }`;
      
      if (model === 'llama') {
        quizData = await llamaService.generateQuiz(subjectContent, questionCount, userProfile.educationLevel || 'High School');
      } else {
        const openaiSubjectContent = subjectContent + `\n\nMODEL-SPECIFIC INSTRUCTIONS FOR OPENAI:
        - Generate questions that are more challenging and complex than basic recall
        - Create unique scenarios and contexts that haven't been used in typical educational materials
        - Ensure each question requires critical thinking and deep understanding of the subject
        - Make incorrect options plausible and challenging to distinguish from the correct answer
        - Focus on higher-order thinking skills: analysis, evaluation, and synthesis`;
        
        quizData = await openaiService.generateQuiz(openaiSubjectContent, questionCount, userProfile.educationLevel || 'High School');
      }
      
      quizData.title = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz`;
      quizData.description = `Test your knowledge of ${subject} fundamentals and key concepts.`;
    };
    
    if (!chatResult.rows.length) {
      console.log(`No chat history found. Generating subject-based quiz.`);
      await generateSubjectQuiz();
      
    } else {
      const chat = chatResult.rows[0];
      const messagesResult = await pool.query(
        'SELECT sender, content FROM messages WHERE chat_id = $1 ORDER BY created_at DESC LIMIT 50',
        [chat.id]
      );
      
      if (!messagesResult.rows.length) {
        console.log(`No messages found in chat. Generating subject-based quiz.`);
        await generateSubjectQuiz();
        
      } else {
        const chatHistory = messagesResult.rows.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })).reverse();

        const conversationSummary = chatHistory
          .map(msg => `${msg.role === 'user' ? 'Student' : 'AI'}: ${msg.content}`)
          .join('\n\n');
        
        const randomSeed = Math.floor(Math.random() * 1000);
        const focusAreas = [
          'key concepts and fundamentals',
          'practical applications and real-world examples',
          'common misconceptions and tricky areas',
          'advanced topics and deeper understanding',
          'problem-solving and critical thinking',
          'terminology and definitions',
          'step-by-step processes and methods',
          'comparisons and contrasts between concepts'
        ];
        
        const numFocusAreas = Math.floor(Math.random() * 2) + 2;
        const shuffledAreas = [...focusAreas].sort(() => 0.5 - Math.random());
        const selectedFocusAreas = shuffledAreas.slice(0, numFocusAreas);
        const selectedFocus = selectedFocusAreas.join(', ');
        
        const quizPrompt = `You are an expert ${subject} tutor. Generate a ${adaptiveDifficulty} difficulty quiz with ${questionCount} questions based on the conversation history below.

          SUBJECT: ${subject.toUpperCase()}
          IMPORTANT: All questions must be about ${subject} topics only. Do NOT include questions about other subjects like science, math, history, etc.

          Student Profile:
          - Age: ${userProfile.age || 18}
          - Education Level: ${userProfile.educationLevel || 'High School'}
          - Learning Goals: ${userProfile.learningGoals || 'General learning'}

          Conversation History:
          ${conversationSummary}

          Instructions:
          - Generate questions ONLY about ${subject} topics discussed in the conversation
          - Focus on ${subject}-specific concepts, terminology, and skills
          - If the conversation doesn't contain enough ${subject} content, generate questions about fundamental ${subject} concepts appropriate for the student's level
          - Create questions that test understanding of the specific ${subject} topics discussed
          - IMPORTANT: Only generate multiple choice questions (with 4 options) and true/false questions
          - Do NOT generate short answer questions
          - Make questions appropriate for ${adaptiveDifficulty} difficulty level for a ${userProfile.educationLevel || 'High School'} student
          - Use vocabulary and concepts appropriate for age ${userProfile.age || 18}
          - Provide clear explanations for correct answers
          - Ensure questions directly relate to ${subject} content from the conversation
          - Generate questions that match the complexity and depth expected for ${userProfile.educationLevel || 'High School'} students
          - CRITICAL: Focus on ${selectedFocus} to ensure variety from previous quizzes
          - Distribute questions across the selected focus areas: ${selectedFocusAreas.join(', ')}
          - Use different question formats, wording, and approaches than typical quiz questions
          - Random seed: ${randomSeed} - use this to ensure unique question generation

          Format the response as JSON:
          {
            "title": "${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz based on your recent study session",
            "description": "Test your knowledge of the ${subject} topics you've been studying",
            "questions": [
              {
                "question": "Question text",
                "type": "multiple-choice",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "Option A",
                "explanation": "Explanation of why this answer is correct"
              },
              {
                "question": "True or False: Statement here",
                "type": "true-false",
                "correctAnswer": "True",
                "explanation": "Explanation of why this answer is correct"
              }
            ]
          }`;

        if (model === 'llama') {
          quizData = await llamaService.generateQuiz(quizPrompt, questionCount, adaptiveDifficulty);
        } else {
          const openaiPrompt = quizPrompt + `\n\nMODEL-SPECIFIC INSTRUCTIONS FOR OPENAI:
          - Generate questions that are more challenging and complex than basic recall
          - Create unique scenarios and contexts that haven't been used in typical educational materials
          - Ensure each question requires critical thinking and deep understanding of the subject
          - Make incorrect options plausible and challenging to distinguish from the correct answer
          - Focus on higher-order thinking skills: analysis, evaluation, and synthesis`;
          
          quizData = await openaiService.generateQuiz(openaiPrompt, questionCount, adaptiveDifficulty);
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        quiz: quizData,
        source: quizData.title.includes('recent study session') ? 'chat_history' : 'subject_based',
        subject: subject,
        model: model,
        questionsGenerated: quizData.questions?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz'
    });
  }
};

const generateFlashcardsFromHistory = async (req, res) => {
  try {
    const { user_id, subject, model = 'openai', cardCount = 10, difficulty = 'medium', userProfile = {} } = req.body;
    
    let adaptiveDifficulty = difficulty;
    if (userProfile.educationLevel && userProfile.age) {
      if (userProfile.educationLevel === 'Elementary' || userProfile.age < 12) {
        adaptiveDifficulty = 'easy';
      } else if (userProfile.educationLevel === 'PhD' || userProfile.age > 25) {
        adaptiveDifficulty = 'hard';
      } else {
        adaptiveDifficulty = 'medium';
      }
    }
    
    const chatResult = await pool.query(
      'SELECT * FROM chats WHERE user_id = $1 AND subject = $2 ORDER BY created_at DESC LIMIT 1',
      [user_id, subject]
    );
    
    let flashcardData;
    
    const generateSubjectFlashcards = async () => {
      const randomSeed = Math.floor(Math.random() * 1000);
      const focusAreas = [
        'key concepts and definitions',
        'important formulas and rules',
        'common examples and applications',
        'critical thinking scenarios',
        'step-by-step processes',
        'comparisons and contrasts',
        'real-world applications',
        'common mistakes and misconceptions'
      ];
      
      const numFocusAreas = Math.floor(Math.random() * 2) + 2;
      const shuffledAreas = [...focusAreas].sort(() => 0.5 - Math.random());
      const selectedFocusAreas = shuffledAreas.slice(0, numFocusAreas);
      const selectedFocus = selectedFocusAreas.join(', ');
      
                    const subjectContent = `You are an expert ${subject} tutor. Generate EXACTLY ${cardCount} comprehensive flashcards about ${subject} topics.

        SUBJECT: ${subject.toUpperCase()}
        IMPORTANT: All flashcards must be about ${subject} topics only. Do NOT include flashcards about other subjects.

        Student Profile:
        - Age: ${userProfile.age || 18}
        - Education Level: ${userProfile.educationLevel || 'High School'}
        - Learning Goals: ${userProfile.learningGoals || 'General learning'}

        Instructions:
        - Generate flashcards ONLY about ${subject} topics and concepts
        - Focus on ${subject}-specific terminology, skills, and fundamental concepts
        - Create flashcards appropriate for a ${userProfile.educationLevel || 'High School'} student
        - Use vocabulary and concepts appropriate for age ${userProfile.age || 18}
        - Each flashcard should have a clear question on the front and a comprehensive answer on the back
        - Questions should be concise but clear
        - Answers should be detailed but concise (2-3 sentences maximum)
        - Ensure flashcards test understanding of ${subject} fundamentals and key concepts appropriate for the student's education level
        - Generate flashcards that match the complexity and depth expected for ${userProfile.educationLevel || 'High School'} students
        - CRITICAL: Focus on ${selectedFocus} to ensure variety from previous flashcard sets
        - Distribute flashcards across the selected focus areas: ${selectedFocusAreas.join(', ')}
        - Use different question formats, wording, and approaches than typical flashcards
        - Random seed: ${randomSeed} - use this to ensure unique flashcard generation

        Format the response as VALID JSON ONLY (no markdown, no code blocks, just pure JSON):
        {
          "title": "${subject.charAt(0).toUpperCase() + subject.slice(1)} Flashcards",
          "description": "Study cards for ${subject} fundamentals and key concepts.",
          "cards": [
            {
              "question": "What is the question?",
              "answer": "This is the detailed answer with explanation and context.",
              "category": "Category of the flashcard"
            }
          ]
        }
        
        CRITICAL: You MUST generate EXACTLY ${cardCount} flashcards. Do not generate fewer or more cards.
        
        IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting, code blocks, or additional text. Keep answers concise and avoid special characters that might break JSON.`;
      
      if (model === 'llama') {
          flashcardData = await llamaService.generateFlashcards(subjectContent, cardCount, userProfile.educationLevel || 'High School');
        } else {
          const openaiSubjectContent = subjectContent + `\n\nMODEL-SPECIFIC INSTRUCTIONS FOR OPENAI:
          - Generate flashcards that are more challenging and comprehensive than basic definitions
          - Create unique scenarios and contexts that haven't been used in typical educational materials
          - Ensure each flashcard requires critical thinking and deep understanding of the subject
          - Make questions thought-provoking and answers educational and detailed
          - Focus on higher-order thinking skills: analysis, evaluation, and synthesis`;
          
          flashcardData = await openaiService.generateFlashcards(openaiSubjectContent, cardCount, userProfile.educationLevel || 'High School');
        }
      
      flashcardData.title = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Flashcards`;
      flashcardData.description = `Study cards for ${subject} fundamentals and key concepts.`;
    };
    
    if (!chatResult.rows.length) {
      console.log(`No chat history found. Generating subject-based flashcards.`);
      await generateSubjectFlashcards();
      
    } else {
      const chat = chatResult.rows[0];
      const messagesResult = await pool.query(
        'SELECT sender, content FROM messages WHERE chat_id = $1 ORDER BY created_at DESC LIMIT 50',
        [chat.id]
      );
      
      if (!messagesResult.rows.length) {
        console.log(`No messages found in chat. Generating subject-based flashcards.`);
        await generateSubjectFlashcards();
        
      } else {
        const chatHistory = messagesResult.rows.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })).reverse();

        const conversationSummary = chatHistory
          .map(msg => `${msg.role === 'user' ? 'Student' : 'AI'}: ${msg.content}`)
          .join('\n\n');
        
        const randomSeed = Math.floor(Math.random() * 10000) + Date.now();
        const focusAreas = [
          'fundamental concepts and definitions',
          'advanced theories and principles',
          'practical applications and examples',
          'problem-solving strategies',
          'analytical thinking scenarios',
          'comparative analysis',
          'real-world case studies',
          'common misconceptions and errors',
          'methodological approaches',
          'theoretical frameworks',
          'historical developments',
          'contemporary applications',
          'cross-disciplinary connections',
          'evaluation and assessment criteria'
        ];
        
        const numFocusAreas = Math.floor(Math.random() * 3) + 2;
        const shuffledAreas = [...focusAreas].sort(() => 0.5 - Math.random());
        const selectedFocusAreas = shuffledAreas.slice(0, numFocusAreas);
        const selectedFocus = selectedFocusAreas.join(', ');
        
        const flashcardPrompt = `You are an expert ${subject} tutor. Generate EXACTLY ${cardCount} flashcards based on the conversation history below.

          SUBJECT: ${subject.toUpperCase()}
          IMPORTANT: All flashcards must be about ${subject} topics only. Do NOT include flashcards about other subjects like science, math, history, etc.

          Student Profile:
          - Age: ${userProfile.age || 18}
          - Education Level: ${userProfile.educationLevel || 'High School'}
          - Learning Goals: ${userProfile.learningGoals || 'General learning'}

          Conversation History:
          ${conversationSummary}

          Instructions:
          - Generate flashcards ONLY about ${subject} topics discussed in the conversation
          - Focus on ${subject}-specific concepts, terminology, and skills
          - If the conversation doesn't contain enough ${subject} content, generate flashcards about fundamental ${subject} concepts appropriate for the student's level
          - Create flashcards that help understand the specific ${subject} topics discussed
          - Each flashcard should have a clear question on the front and a comprehensive answer on the back
          - Questions should be concise but clear
          - Answers should be detailed but concise (2-3 sentences maximum)
          - Make flashcards appropriate for a ${userProfile.educationLevel || 'High School'} student
          - Use vocabulary and concepts appropriate for age ${userProfile.age || 18}
          - Provide clear, educational answers that help with understanding
          - Ensure flashcards directly relate to ${subject} content from the conversation
          - Generate flashcards that match the complexity and depth expected for ${userProfile.educationLevel || 'High School'} students
          - CRITICAL: Focus on ${selectedFocus} to ensure variety from previous flashcard sets
          - Distribute flashcards across the selected focus areas: ${selectedFocusAreas.join(', ')}
          - Use different question formats, wording, and approaches than typical flashcards
          - Random seed: ${randomSeed} - use this to ensure unique flashcard generation
          - IMPORTANT: Each flashcard must be completely different from typical educational materials
          - Use unique scenarios, contexts, and examples that haven't been used before
          - Vary question types: definitions, applications, analysis, synthesis, evaluation

          Format the response as VALID JSON ONLY (no markdown, no code blocks, just pure JSON):
          {
            "title": "${subject.charAt(0).toUpperCase() + subject.slice(1)} Flashcards based on your recent study session",
            "description": "Study cards for the ${subject} topics you've been studying",
            "cards": [
              {
                "question": "What is the question?",
                "answer": "This is the detailed answer with explanation and context.",
                "category": "Category of the flashcard"
              }
            ]
          }
          
          CRITICAL: You MUST generate EXACTLY ${cardCount} flashcards. Do not generate fewer or more cards.
          
          IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting, code blocks, or additional text. Keep answers concise and avoid special characters that might break JSON.`;

        if (model === 'llama') {
          const llamaPrompt = flashcardPrompt + `\n\nMODEL-SPECIFIC INSTRUCTIONS FOR LLAMA:
          - Generate flashcards that are significantly different from typical educational content
          - Use unique contexts, scenarios, and examples that haven't been used before
          - Ensure each flashcard requires deep understanding and critical thinking
          - Make questions challenging and thought-provoking for the student's level
          - Focus on practical applications and real-world connections
          - Vary the complexity and approach for each flashcard
          - Use the random seed ${randomSeed} to create completely unique content
          - Avoid repetitive question patterns or similar content structures`;
          
          flashcardData = await llamaService.generateFlashcards(llamaPrompt, cardCount, userProfile.educationLevel || 'High School');
        } else {
          const openaiPrompt = flashcardPrompt + `\n\nMODEL-SPECIFIC INSTRUCTIONS FOR OPENAI:
          - Generate flashcards that are more challenging and comprehensive than basic definitions
          - Create unique scenarios and contexts that haven't been used in typical educational materials
          - Ensure each flashcard requires critical thinking and deep understanding of the subject
          - Make questions thought-provoking and answers educational and detailed
          - Focus on higher-order thinking skills: analysis, evaluation, and synthesis
          - Use the random seed ${randomSeed} to create completely unique content
          - Vary question complexity and approach for each flashcard
          - Avoid repetitive patterns or similar content structures`;
          
          flashcardData = await openaiService.generateFlashcards(openaiPrompt, cardCount, userProfile.educationLevel || 'High School');
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        flashcards: flashcardData,
        source: flashcardData.title.includes('recent study session') ? 'chat_history' : 'subject_based',
        subject: subject,
        model: model,
        cardsGenerated: flashcardData.cards?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Flashcard generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate flashcards'
    });
  }
};

module.exports = {
  sendMessage,
  generateQuizFromHistory,
  generateFlashcardsFromHistory
}; 