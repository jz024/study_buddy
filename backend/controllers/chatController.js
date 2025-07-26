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
      const subjectContent = `You are an expert ${subject} tutor. Generate a comprehensive ${adaptiveDifficulty} difficulty quiz with ${questionCount} questions about ${subject} topics.

        SUBJECT: ${subject.toUpperCase()}
        IMPORTANT: All questions must be about ${subject} topics only. Do NOT include questions about other subjects.

        Student Profile:
        - Age: ${userProfile.age || 18}
        - Education Level: ${userProfile.educationLevel || 'High School'}
        - Learning Goals: ${userProfile.learningGoals || 'General learning'}

        Instructions:
        - Generate questions ONLY about ${subject} topics and concepts
        - Focus on ${subject}-specific terminology, skills, and fundamental concepts
        - Create questions appropriate for ${adaptiveDifficulty} difficulty level for a ${userProfile.educationLevel || 'High School'} student
        - Use vocabulary and concepts appropriate for age ${userProfile.age || 18}
        - IMPORTANT: Only generate multiple choice questions (with 4 options) and true/false questions
        - Do NOT generate short answer questions
        - For multiple choice questions, provide 4 distinct options without prefixes like "Option A", "Option B", etc.
        - Provide clear explanations for correct answers
        - Ensure questions test understanding of ${subject} fundamentals and key concepts appropriate for the student's education level
        - Generate questions that match the complexity and depth expected for ${userProfile.educationLevel || 'High School'} students

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
        quizData = await llamaService.generateQuiz(subjectContent, questionCount, adaptiveDifficulty);
      } else {
        quizData = await openaiService.generateQuiz(subjectContent, questionCount, adaptiveDifficulty);
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
          quizData = await openaiService.generateQuiz(quizPrompt, questionCount, adaptiveDifficulty);
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

module.exports = {
  sendMessage,
  generateQuizFromHistory
}; 