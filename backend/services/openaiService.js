const { OpenAI } = require('openai');

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI client initialized');
} else {
  console.log('⚠️ OpenAI API key not found - using placeholder responses');
}

class OpenAIService {
  async generateChatResponse(messages, context = '') {
    try {
      if (!openai) {
        return {
          content: "I'm sorry, but I'm currently in demo mode. The OpenAI API key is not configured. Please set up your OpenAI API key to enable full AI functionality.",
          tokensUsed: 0
        };
      }

      const hasSystemMessage = messages.length > 0 && messages[0].role === 'system';
      
      let finalMessages = messages;
      if (!hasSystemMessage) {
        const systemMessage = {
          role: 'system',
          content: `You are an AI study buddy helping students learn. ${context ? `Context: ${context}` : ''} Be helpful, encouraging, and educational in your responses. Always maintain context from previous messages.`
        };
        finalMessages = [systemMessage, ...messages];
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: finalMessages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return {
        content: response.choices[0].message.content,
        tokensUsed: response.usage.total_tokens
      };
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateQuiz(content, questionCount = 5, difficulty = 'medium') {
    try {
      if (!openai) {
        console.log('OpenAI client not initialized - returning placeholder quiz');
        return {
          title: "Sample Quiz",
          questions: [
            {
              question: "This is a sample question?",
              type: "multiple-choice",
              options: ["A", "B", "C", "D"],
              correctAnswer: "A",
              explanation: "This is a sample explanation"
            }
          ]
        };
      }

      const prompt = content;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      });

      const quizText = response.choices[0].message.content;
      return JSON.parse(quizText);
    } catch (error) {
      console.error('OpenAI quiz generation error:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  async generateFlashcards(content, cardCount = 10, difficulty = 'medium') {
    try {
      if (!openai) {
        console.log('OpenAI client not initialized - returning placeholder flashcards');
        return {
          title: "Sample Flashcards",
          cards: [
            {
              question: "What is a sample question?",
              answer: "This is a sample answer with explanation.",
              category: "Sample Category"
            }
          ]
        };
      }

      const prompt = content;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      });

      const flashcardText = response.choices[0].message.content;
      
      let cleanedText = flashcardText.trim();
      
      // Basic cleanup
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '');
      }
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '');
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.replace(/\s*```$/, '');
      }
      
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedText);
      } catch (initialError) {
        console.log('Initial JSON parse failed, attempting to extract valid JSON structure...');
        
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          let extractedJson = jsonMatch[0];
          
          try {
            extractedJson = extractedJson.replace(/,(\s*[}\]])/g, '$1');
            extractedJson = extractedJson.replace(/，/g, ',');
            
            parsedData = JSON.parse(extractedJson);
          } catch (extractError) {
            console.log('Extracted JSON parse failed, building fallback structure...');
            
            const cards = [];
            const cardMatches = cleanedText.match(/"question":\s*"([^"]+)"/g);
            const answerMatches = cleanedText.match(/"answer":\s*"([^"]+)"/g);
            
            if (cardMatches && answerMatches) {
              for (let i = 0; i < Math.min(cardMatches.length, answerMatches.length); i++) {
                const question = cardMatches[i].match(/"question":\s*"([^"]+)"/)?.[1] || 'Question not available';
                const answer = answerMatches[i].match(/"answer":\s*"([^"]+)"/)?.[1] || 'Answer not available';
                
                cards.push({
                  question: question,
                  answer: answer,
                  category: 'General'
                });
              }
            }
            
            parsedData = {
              title: "Generated Flashcards",
              description: "Study cards for your learning session",
              cards: cards.length > 0 ? cards : [
                {
                  question: "What is the main topic you've been studying?",
                  answer: "Based on your study session, focus on understanding the key concepts and their applications.",
                  category: "Study Focus"
                }
              ]
            };
          }
        } else {
          parsedData = {
            title: "Generated Flashcards",
            description: "Study cards for your learning session",
            cards: [
              {
                question: "What is the main topic you've been studying?",
                answer: "Based on your study session, focus on understanding the key concepts and their applications.",
                category: "Study Focus"
              }
            ]
          };
                }
      }

      if (parsedData.cards && Array.isArray(parsedData.cards)) {
        parsedData.cards = parsedData.cards.map(card => ({
          question: (card.question || '').replace(/"/g, '\\"').substring(0, 500),
          answer: (card.answer || '').replace(/"/g, '\\"').substring(0, 1000),
          category: (card.category || 'General').replace(/"/g, '\\"').substring(0, 100)
        }));
        
        if (parsedData.cards.length < cardCount) {
          console.log(`Generated ${parsedData.cards.length} cards, need ${cardCount}. Adding placeholder cards.`);
          const placeholderCards = [];
          for (let i = parsedData.cards.length; i < cardCount; i++) {
            placeholderCards.push({
              question: `Additional question ${i + 1} about the topic?`,
              answer: `This is an additional answer to help you study the material more thoroughly.`,
              category: 'Additional'
            });
          }
          parsedData.cards = [...parsedData.cards, ...placeholderCards];
        } else if (parsedData.cards.length > cardCount) {
          console.log(`Generated ${parsedData.cards.length} cards, need ${cardCount}. Truncating to ${cardCount}.`);
          parsedData.cards = parsedData.cards.slice(0, cardCount);
        }
      }
      
      return parsedData;
    } catch (error) {
      console.error('OpenAI flashcard generation error:', error);
      throw new Error('Failed to generate flashcards');
    }
  }
}

module.exports = new OpenAIService(); 