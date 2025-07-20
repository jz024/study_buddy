const axios = require('axios');

async function testLlamaChat() {
  const baseUrl = 'http://localhost:5001';
  
  console.log('🧪 Testing Llama Chat History...\n');
  
  try {
    // Test 1: Initial question
    console.log('📝 Test 1: Initial question');
    const response1 = await axios.post(`${baseUrl}/api/chat`, {
      message: "What is 2+2?",
      model: "llama",
      history: []
    });
    
    console.log('Response 1:', response1.data.data.aiResponse);
    console.log('History sent:', []);
    console.log('');
    
    // Test 2: Follow-up question with history
    console.log('📝 Test 2: Follow-up question with history');
    const history = [
      { role: 'user', content: 'What is 2+2?' },
      { role: 'assistant', content: response1.data.data.aiResponse }
    ];
    
    const response2 = await axios.post(`${baseUrl}/api/chat`, {
      message: "What about 3+3?",
      model: "llama",
      history: history
    });
    
    console.log('Response 2:', response2.data.data.aiResponse);
    console.log('History sent:', history);
    console.log('');
    
    // Test 3: Another follow-up
    console.log('📝 Test 3: Another follow-up');
    const history2 = [
      ...history,
      { role: 'user', content: 'What about 3+3?' },
      { role: 'assistant', content: response2.data.data.aiResponse }
    ];
    
    const response3 = await axios.post(`${baseUrl}/api/chat`, {
      message: "Now what is 4+4?",
      model: "llama",
      history: history2
    });
    
    console.log('Response 3:', response3.data.data.aiResponse);
    console.log('History sent:', history2);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLlamaChat(); 