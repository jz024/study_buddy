const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class FileService {
  async extractTextFromFile(filePath, mimeType) {
    try {
      let text = '';
      
      if (mimeType === 'application/pdf') {
        text = await this.extractTextFromPDF(filePath);
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await this.extractTextFromDOCX(filePath);
      } else {
        throw new Error('Unsupported file type');
      }

      return text;
    } catch (error) {
      console.error('File extraction error:', error);
      throw new Error('Failed to extract text from file');
    }
  }

  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  async extractTextFromDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Failed to extract text from DOCX');
    }
  }

  deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    } catch (error) {
      console.error('File deletion error:', error);
    }
  }

  getFileInfo(file) {
    return {
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype
    };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isValidFileType(mimeType) {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedTypes.includes(mimeType);
  }

  async processUploadedFile(file) {
    try {
      const fileInfo = this.getFileInfo(file);
      const extractedText = await this.extractTextFromFile(file.path, file.mimetype);
      
      // Clean up the uploaded file after processing
      setTimeout(() => {
        this.deleteFile(file.path);
      }, 5000); // Delete after 5 seconds

      return {
        fileInfo,
        extractedText,
        wordCount: extractedText.split(/\s+/).length
      };
    } catch (error) {
      // Clean up file on error
      this.deleteFile(file.path);
      throw error;
    }
  }
}

module.exports = new FileService(); 