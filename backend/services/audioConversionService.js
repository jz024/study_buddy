const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

class AudioConversionService {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.ensureTempDir();
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async convertWebmToWav(audioBuffer) {
    const inputPath = path.join(this.tempDir, `input_${Date.now()}.webm`);
    const outputPath = path.join(this.tempDir, `output_${Date.now()}.wav`);

    try {
      // Write input buffer to file
      await writeFile(inputPath, audioBuffer);

      // Convert using ffmpeg
      await this.runFfmpegConversion(inputPath, outputPath);

      // Read converted file
      const convertedBuffer = fs.readFileSync(outputPath);

      // Clean up files
      await this.cleanupFiles([inputPath, outputPath]);

      return convertedBuffer;
    } catch (error) {
      // Clean up files on error
      await this.cleanupFiles([inputPath, outputPath]);
      throw error;
    }
  }

  async runFfmpegConversion(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('wav')
        .audioChannels(1) // Mono
        .audioFrequency(16000) // 16kHz sample rate
        .audioCodec('pcm_s16le') // 16-bit PCM
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        })
        .save(outputPath);
    });
  }

  async cleanupFiles(filePaths) {
    for (const filePath of filePaths) {
      try {
        if (fs.existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        // Silent cleanup error
      }
    }
  }

  async convertToGoogleSpeechFormat(audioBuffer, originalFormat) {
    try {
      // If it's already a supported format, return as is
      if (originalFormat === 'audio/wav' || originalFormat === 'audio/flac') {
        return {
          buffer: audioBuffer,
          encoding: 'LINEAR16',
          sampleRateHertz: 16000
        };
      }

      // Convert WEBM OPUS to WAV
      if (originalFormat === 'audio/webm;codecs=opus' || originalFormat === 'audio/webm') {
        console.log('Converting WEBM OPUS to WAV for better Google Speech API compatibility');
        const convertedBuffer = await this.convertWebmToWav(audioBuffer);
        return {
          buffer: convertedBuffer,
          encoding: 'LINEAR16',
          sampleRateHertz: 16000
        };
      }

      // For other formats, try conversion
      console.log('Converting audio to WAV format');
      const convertedBuffer = await this.convertWebmToWav(audioBuffer);
      return {
        buffer: convertedBuffer,
        encoding: 'LINEAR16',
        sampleRateHertz: 16000
      };
    } catch (error) {
      console.error('Audio conversion failed:', error.message);
      // Return original buffer as fallback
      return {
        buffer: audioBuffer,
        encoding: 'OGG_OPUS',
        sampleRateHertz: 48000
      };
    }
  }
}

module.exports = new AudioConversionService(); 