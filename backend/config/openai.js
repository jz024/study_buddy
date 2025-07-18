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

module.exports = openai; 