const axios = require('axios');

async function testSpeechRoutes() {
  const baseUrl = process.env.TEST_URL || 'http://localhost:5001';
  
  console.log('Testing speech routes at:', baseUrl);
  
  try {
    // Test the speech test endpoint
    console.log('\n1. Testing /api/speech-test...');
    const testResponse = await axios.get(`${baseUrl}/api/speech-test`);
    console.log('✅ Speech test endpoint working:', testResponse.data);
    
    // Test the speech transcribe endpoint with mock data
    console.log('\n2. Testing /api/speech/transcribe-base64...');
    const mockAudioData = Buffer.from('mock audio data').toString('base64');
    const transcribeResponse = await axios.post(`${baseUrl}/api/speech/transcribe-base64`, {
      audioData: mockAudioData,
      encoding: 'audio/webm;codecs=opus',
      languageCode: 'en-US'
    });
    console.log('✅ Speech transcribe endpoint working:', transcribeResponse.data);
    
    console.log('\n🎉 All speech routes are working correctly!');
    
  } catch (error) {
    console.error('❌ Speech route test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
}

testSpeechRoutes(); 