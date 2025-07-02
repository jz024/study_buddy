const speech = require('@google-cloud/speech');

let audioConversionService;
try {
  audioConversionService = require('./audioConversionService');
  console.log('Audio conversion service loaded successfully');
} catch (error) {
  console.log('Audio conversion service not available:', error.message);
  audioConversionService = null;
}

class SpeechToTextService {
  constructor() {
    this.client = new speech.SpeechClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      }
    });
  }

  async transcribeAudio(audioBuffer, encoding = 'OGG_OPUS', sampleRateHertz = 48000, languageCode = 'en-US') {
    try {
      const audio = {
        content: audioBuffer.toString('base64')
      };

      const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        enableAutomaticPunctuation: true
      };

      const [response] = await this.client.recognize({ audio, config });
      
      if (response.results && response.results.length > 0) {
        const transcript = response.results
          .map(result => result.alternatives[0].transcript)
          .join(' ');
        
        return {
          success: true,
          transcript: transcript,
          confidence: response.results[0].alternatives[0].confidence
        };
      } else {
        return {
          success: false,
          transcript: '',
          confidence: 0,
          error: 'No speech detected'
        };
      }
    } catch (error) {
      return {
        success: false,
        transcript: '',
        confidence: 0,
        error: error.message
      };
    }
  }

  async transcribeAudioStream(audioStream, encoding = 'LINEAR16', sampleRateHertz = 16000, languageCode = 'en-US') {
    try {
      const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false,
        model: 'latest_long'
      };

      const request = {
        config: config,
        interimResults: true,
      };

      const recognizeStream = this.client
        .streamingRecognize(request)
        .on('error', console.error)
        .on('data', data => {
          if (data.results[0] && data.results[0].alternatives[0]) {
            const transcript = data.results[0].alternatives[0].transcript;
            console.log(`Transcription: ${transcript}`);
          }
        });

      audioStream.pipe(recognizeStream);

      return recognizeStream;
    } catch (error) {
      console.error('Streaming Speech-to-Text Error:', error);
      throw error;
    }
  }
}

module.exports = new SpeechToTextService(); 