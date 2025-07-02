const express = require('express');
const multer = require('multer');
const speechToTextService = require('../services/speechToTextService');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Speech-to-Text route is working!',
    timestamp: new Date().toISOString()
  });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  console.log('Transcribe endpoint hit');
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file provided'
      });
    }

    const { encoding = 'LINEAR16', sampleRateHertz = 16000, languageCode = 'en-US' } = req.body;

    const result = await speechToTextService.transcribeAudio(
      req.file.buffer,
      encoding,
      parseInt(sampleRateHertz),
      languageCode
    );

    if (result.success) {
      res.json({
        success: true,
        data: {
          transcript: result.transcript,
          confidence: result.confidence
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to transcribe audio'
      });
    }
  } catch (error) {
    console.error('Speech transcription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during transcription'
    });
  }
});

router.post('/transcribe-base64', async (req, res) => {
  try {
    const { audioData, encoding, sampleRateHertz, languageCode = 'en-US' } = req.body;

    if (!audioData) {
      return res.status(400).json({
        success: false,
        message: 'No audio data provided'
      });
    }

    const audioBuffer = Buffer.from(audioData, 'base64');

    const result = await speechToTextService.transcribeAudio(
      audioBuffer,
      encoding,
      sampleRateHertz ? parseInt(sampleRateHertz) : null,
      languageCode
    );

    if (result.success) {
      res.json({
        success: true,
        data: {
          transcript: result.transcript,
          confidence: result.confidence
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to transcribe audio'
      });
    }
  } catch (error) {
    console.error('Speech transcription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during transcription'
    });
  }
});

module.exports = router; 