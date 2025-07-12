const openaiService = require('../services/openaiService');
const llamaService = require('../services/llamaService');
const mistralService = require('../services/mistralService');
const { testQuestions } = require('../data/testQuestions');
const simpleEvaluator = require('../services/simpleEvaluator');

const sendMessage = async (req, res) => {
  try {
    const { message, subjectId, model = 'openai' } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const messages = [{ role: 'user', content: message }];
    
    let response;
    if (model === 'llama') {
      response = await llamaService.generateChatResponse(messages);
    } else if (model === 'mistral') {
      response = await mistralService.generateChatResponse(messages);
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

// Comprehensive Testing: Compare all 3 models
const runComprehensiveTest = async (req, res) => {
  try {
    console.log(`🧪 Running comprehensive test: OpenAI vs Llama vs Mistral`);
    
    const results = [];
    const models = ['openai', 'llama', 'mistral'];
    
    for (const question of testQuestions) {
      console.log(`Testing question ${question.id}: ${question.question.substring(0, 50)}...`);
      
      const questionResults = {
        questionId: question.id,
        question: question.question,
        subject: question.subject,
        difficulty: question.difficulty,
        expectedKeywords: question.expectedKeywords,
        models: {}
      };
      
      // Test all 3 models
      for (const model of models) {
        const response = await getModelResponse(question.question, model);
        const evaluation = simpleEvaluator.evaluateResponse(response.content, question.expectedKeywords);
        
        questionResults.models[model] = {
          model: model,
          response: response.content,
          responseTime: response.responseTime,
          tokensUsed: response.tokensUsed,
          evaluation: evaluation
        };
      }
      
      results.push(questionResults);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Calculate comprehensive summary
    const summary = calculateComprehensiveSummary(results);
    
    res.json({
      success: true,
      data: {
        testType: 'Comprehensive',
        models: models,
        results: results,
        summary: summary
      }
    });
    
  } catch (error) {
    console.error('Comprehensive test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run comprehensive test'
    });
  }
};

// A/A Testing: Test same model twice for consistency
const runAATest = async (req, res) => {
  try {
    const { model = 'openai' } = req.body;
    
    console.log(`🔄 Running A/A test for ${model}`);
    
    const results = [];
    
    for (const question of testQuestions) {
      console.log(`Testing question ${question.id}: ${question.question.substring(0, 50)}...`);
      
      // Test Model twice
      const response1 = await getModelResponse(question.question, model);
      const response2 = await getModelResponse(question.question, model);
      
      const eval1 = simpleEvaluator.evaluateResponse(response1.content, question.expectedKeywords);
      const eval2 = simpleEvaluator.evaluateResponse(response2.content, question.expectedKeywords);
      const comparison = simpleEvaluator.compareResponses(response1.content, response2.content, question.expectedKeywords);
      
      results.push({
        questionId: question.id,
        question: question.question,
        subject: question.subject,
        difficulty: question.difficulty,
        expectedKeywords: question.expectedKeywords,
        run1: {
          response: response1.content,
          responseTime: response1.responseTime,
          tokensUsed: response1.tokensUsed,
          evaluation: eval1
        },
        run2: {
          response: response2.content,
          responseTime: response2.responseTime,
          tokensUsed: response2.tokensUsed,
          evaluation: eval2
        },
        consistency: comparison
      });
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Calculate consistency summary
    const summary = calculateAATestSummary(results, model);
    
    res.json({
      success: true,
      data: {
        testType: 'A/A',
        model: model,
        results: results,
        summary: summary
      }
    });
    
  } catch (error) {
    console.error('A/A test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run A/A test'
    });
  }
};

// Helper function to get model response
async function getModelResponse(question, model) {
  const startTime = Date.now();
  
  try {
    const messages = [{ role: 'user', content: question }];
    
    let response;
    if (model === 'llama') {
      response = await llamaService.generateChatResponse(messages);
    } else if (model === 'mistral') {
      response = await mistralService.generateChatResponse(messages);
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

// Calculate comprehensive test summary
function calculateComprehensiveSummary(results) {
  const models = ['openai', 'llama', 'mistral'];
  const summary = {
    totalQuestions: results.length,
    modelStats: {},
    rankings: {
      relevance: [],
      speed: [],
      efficiency: []
    }
  };
  
  // Calculate stats for each model
  for (const model of models) {
    const modelResults = results.map(r => r.models[model]);
    const avgRelevance = modelResults.reduce((sum, r) => sum + r.evaluation.relevance, 0) / modelResults.length;
    const avgResponseTime = modelResults.reduce((sum, r) => sum + r.responseTime, 0) / modelResults.length;
    const avgTokens = modelResults.reduce((sum, r) => sum + r.tokensUsed, 0) / modelResults.length;
    
    summary.modelStats[model] = {
      avgRelevance: avgRelevance,
      avgResponseTime: Math.round(avgResponseTime),
      avgTokens: Math.round(avgTokens),
      totalWins: 0
    };
  }
  
  // Calculate wins for each model
  for (const result of results) {
    const relevances = models.map(model => result.models[model].evaluation.relevance);
    const maxRelevance = Math.max(...relevances);
    const winningModels = models.filter(model => result.models[model].evaluation.relevance === maxRelevance);
    
    for (const winningModel of winningModels) {
      summary.modelStats[winningModel].totalWins++;
    }
  }
  
  // Create rankings
  summary.rankings.relevance = models.sort((a, b) => summary.modelStats[b].avgRelevance - summary.modelStats[a].avgRelevance);
  summary.rankings.speed = models.sort((a, b) => summary.modelStats[a].avgResponseTime - summary.modelStats[b].avgResponseTime);
  summary.rankings.efficiency = models.sort((a, b) => summary.modelStats[a].avgTokens - summary.modelStats[b].avgTokens);
  
  // Overall winner (based on most wins)
  const wins = models.map(model => ({ model, wins: summary.modelStats[model].totalWins }));
  wins.sort((a, b) => b.wins - a.wins);
  summary.overallWinner = wins[0].model;
  
  return summary;
}

// Calculate A/A test summary
function calculateAATestSummary(results, model) {
  const consistentResponses = results.filter(r => r.consistency.isConsistent).length;
  const inconsistentResponses = results.length - consistentResponses;
  
  const avgConsistency = results.reduce((sum, r) => sum + r.consistency.consistency, 0) / results.length;
  const avgLengthDifference = results.reduce((sum, r) => sum + r.consistency.lengthDifference, 0) / results.length;
  
  return {
    totalQuestions: results.length,
    consistentResponses: consistentResponses,
    inconsistentResponses: inconsistentResponses,
    consistencyRate: (consistentResponses / results.length) * 100,
    avgConsistency: avgConsistency,
    avgLengthDifference: Math.round(avgLengthDifference),
    isConsistent: (consistentResponses / results.length) > 0.7 // 70% threshold
  };
}

module.exports = {
  sendMessage,
  runComprehensiveTest,
  runAATest
}; 