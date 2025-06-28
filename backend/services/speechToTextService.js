const speech = require('@google-cloud/speech');

// Try to load audio conversion service, but don't fail if it's not available
let audioConversionService;
try {
  audioConversionService = require('./audioConversionService');
  console.log('✅ Audio conversion service loaded successfully');
} catch (error) {
  console.log('⚠️ Audio conversion service not available:', error.message);
  audioConversionService = null;
}

class SpeechToTextService {
  constructor() {
    // Check if Google Cloud credentials are available
    if (process.env.GOOGLE_CLOUD_PROJECT_ID && (process.env.GOOGLE_CLOUD_KEY_FILE || process.env.GOOGLE_CLOUD_PRIVATE_KEY)) {
      this.client = new speech.SpeechClient({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE || null,
        credentials: process.env.GOOGLE_CLOUD_PRIVATE_KEY ? {
          private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        } : undefined
      });
      console.log('✅ Google Cloud Speech-to-Text client initialized');
    } else {
      console.log('⚠️ Google Cloud credentials not found - using mock responses');
      this.client = null;
    }
  }

  async transcribeAudio(audioBuffer, encoding = null, sampleRateHertz = null, languageCode = 'en-US') {
    try {
      // If Google Cloud client is not initialized, return mock response
      if (!this.client) {
        return {
          success: true,
          transcript: "This is a mock transcription. Please configure Google Cloud Speech-to-Text API for real transcription.",
          confidence: 0.95
        };
      }

      // For very short audio, it might not contain speech
      if (audioBuffer.length < 1000) {
        return {
          success: false,
          transcript: '',
          confidence: 0,
          error: 'Audio too short - please record for at least 1-2 seconds'
        };
      }

      // Convert audio to Google Speech API compatible format
      const originalFormat = encoding || 'audio/webm;codecs=opus';
      console.log('Processing audio:', { length: audioBuffer.length, format: originalFormat });
      
      let convertedAudio;
      if (audioConversionService) {
        convertedAudio = await audioConversionService.convertToGoogleSpeechFormat(audioBuffer, originalFormat);
        console.log('Audio converted:', { encoding: convertedAudio.encoding, sampleRate: convertedAudio.sampleRateHertz });
      } else {
        // Fallback when audio conversion service is not available
        console.log('Audio conversion service not available, using original format');
        convertedAudio = {
          buffer: audioBuffer,
          encoding: 'OGG_OPUS',
          sampleRateHertz: 48000
        };
      }

      const audio = {
        content: convertedAudio.buffer.toString('base64')
      };

      const config = {
        encoding: convertedAudio.encoding,
        sampleRateHertz: convertedAudio.sampleRateHertz,
        languageCode: languageCode,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false,
        model: 'latest_long',
        useEnhanced: true,
        enableWordConfidence: true,
        maxAlternatives: 1
      };

      const request = {
        audio: audio,
        config: config,
      };

      console.log('Sending to Google Speech API with config:', { encoding: config.encoding, sampleRate: config.sampleRateHertz });
      const [response] = await this.client.recognize(request);
      
      if (response.results && response.results.length > 0) {
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join(' ');
        
        console.log('Transcription successful:', transcription);
        return {
          success: true,
          transcript: transcription,
          confidence: response.results[0].alternatives[0].confidence
        };
      } else {
        console.log('No speech detected in response');
        
        // Try with different model as fallback
        const fallbackConfig = {
          ...config,
          model: 'command_and_search',
          useEnhanced: false
        };
        
        const fallbackRequest = {
          audio: audio,
          config: fallbackConfig,
        };
        
        try {
          console.log('Trying fallback model...');
          const [fallbackResponse] = await this.client.recognize(fallbackRequest);
          
          if (fallbackResponse.results && fallbackResponse.results.length > 0) {
            const transcription = fallbackResponse.results
              .map(result => result.alternatives[0].transcript)
              .join(' ');
            
            console.log('Fallback transcription successful:', transcription);
            return {
              success: true,
              transcript: transcription,
              confidence: fallbackResponse.results[0].alternatives[0].confidence
            };
          }
        } catch (fallbackError) {
          console.log('Fallback attempt failed:', fallbackError.message);
        }
        
        return {
          success: false,
          transcript: '',
          confidence: 0,
          error: 'No speech detected. Please try speaking more clearly or for a longer duration.'
        };
      }
    } catch (error) {
      console.error('Speech-to-Text Error:', error.message);
      
      return {
        success: false,
        transcript: '',
        confidence: 0,
        error: `Speech recognition failed: ${error.message}`
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