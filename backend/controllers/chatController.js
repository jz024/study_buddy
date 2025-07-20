const openaiService = require('../services/openaiService');
const llamaService = require('../services/llamaService');


const sendMessage = async (req, res) => {
  try {
    const { message, subjectId, model = 'openai', history } = req.body;
    if (!message && (!history || !Array.isArray(history) || history.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message or history is required'
      });
    }
    const messages = (history && Array.isArray(history) && history.length > 0)
      ? history
      : [{ role: 'user', content: message }];
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

const runFollowUpTest = async (req, res) => {
  try {
    const { model = 'openai' } = req.body;
    const followUpScenarios = [
      {
        id: 'project_management',
        subject: 'Project Management',
        initialQuestion: 'List the main phases of a software development lifecycle.',
        followUpQuestion: 'Can you explain the third phase in more detail?'
      },
      {
        id: 'essay_writing',
        subject: 'Essay Writing',
        initialQuestion: 'What are the typical sections of a scientific research paper?',
        followUpQuestion: 'What is the purpose of the section you mentioned just before the conclusion?'
      },
      {
        id: 'mathematics',
        subject: 'Mathematics',
        initialQuestion: 'Describe the steps to solve a system of linear equations using substitution.',
        followUpQuestion: 'How would you apply the last step you described to a real example?'
      },
      {
        id: 'research',
        subject: 'Research',
        initialQuestion: 'Outline the process of conducting a literature review.',
        followUpQuestion: 'Can you elaborate on the step that comes after identifying key sources?'
      },
      {
        id: 'business',
        subject: 'Business',
        initialQuestion: 'What are the essential elements of a marketing plan?',
        followUpQuestion: 'Could you provide more details about the element you listed second?'
      },
      {
        id: 'history',
        subject: 'History',
        initialQuestion: 'Summarize the causes of World War I.',
        followUpQuestion: 'Can you expand on the cause you mentioned last?'
      },
      {
        id: 'biology',
        subject: 'Biology',
        initialQuestion: 'List the stages of mitosis.',
        followUpQuestion: 'What happens during the stage that comes right after metaphase?'
      },
      {
        id: 'programming',
        subject: 'Programming',
        initialQuestion: 'What are the main principles of object-oriented programming?',
        followUpQuestion: 'Can you explain the principle you mentioned first with an example?'
      },
      {
        id: 'economics',
        subject: 'Economics',
        initialQuestion: 'Describe the basic steps in conducting a cost-benefit analysis.',
        followUpQuestion: 'Could you go into more detail about the step that involves estimating costs?'
      },
      {
        id: 'geography',
        subject: 'Geography',
        initialQuestion: 'Name the major climate zones on Earth.',
        followUpQuestion: 'What are the main characteristics of the zone you listed last?'
      }
    ];
    const results = [];
    for (const scenario of followUpScenarios) {
      // Get initial response
      const initialResponse = await getModelResponse(scenario.initialQuestion, model);
      // Create conversation context with initial Q&A
      const conversationContext = [
        { role: 'user', content: scenario.initialQuestion },
        { role: 'assistant', content: initialResponse.content },
        { role: 'user', content: scenario.followUpQuestion }
      ];
      // Get follow-up response with context
      const followUpResponse = await getModelResponseWithContext(conversationContext, model);
      // Word count for each response
      const initialWordCount = initialResponse.content.split(/\s+/).length;
      const followUpWordCount = followUpResponse.content.split(/\s+/).length;
      results.push({
        scenarioId: scenario.id,
        subject: scenario.subject,
        initialQuestion: scenario.initialQuestion,
        initialResponse: initialResponse.content,
        initialWordCount,
        initialResponseTime: initialResponse.responseTime,
        followUpQuestion: scenario.followUpQuestion,
        followUpResponse: followUpResponse.content,
        followUpWordCount,
        followUpResponseTime: followUpResponse.responseTime
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    res.json({
      success: true,
      data: {
        testType: 'FollowUp',
        model: model,
        results: results
      }
    });
  } catch (error) {
    console.error('Follow-up test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run follow-up test'
    });
  }
};

async function getModelResponse(question, model) {
  const startTime = Date.now();
  try {
    const messages = [{ role: 'user', content: question }];
    let response;
    if (model === 'llama') {
      response = await llamaService.generateChatResponse(messages);
    } else {
      response = await openaiService.generateChatResponse(messages);
    }
    return {
      content: response.content,
      responseTime: Date.now() - startTime,
      tokensUsed: response.tokensUsed || 0
    };
  } catch (error) {
    console.error(`Error getting response from ${model}:`, error);
    return {
      content: 'Error: Failed to generate response',
      responseTime: Date.now() - startTime,
      tokensUsed: 0
    };
  }
}

async function getModelResponseWithContext(messages, model) {
  const startTime = Date.now();
  try {
    let response;
    if (model === 'llama') {
      response = await llamaService.generateChatResponse(messages);
    } else {
      response = await openaiService.generateChatResponse(messages);
    }
    return {
      content: response.content,
      responseTime: Date.now() - startTime,
      tokensUsed: response.tokensUsed || 0
    };
  } catch (error) {
    console.error(`Error getting response from ${model}:`, error);
    return {
      content: 'Error: Failed to generate response',
      responseTime: Date.now() - startTime,
      tokensUsed: 0
    };
  }
}

module.exports = {
  sendMessage,
  runFollowUpTest
}; 