const { PDFParse } = require('pdf-parse');
const ApiError = require('../utils/ApiError');

async function extractText(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const uint8 = new Uint8Array(buffer);
    const parser = new PDFParse(uint8);
    await parser.load();
    const result = await parser.getText();
    const text = result.text || '';
    if (text.trim().length === 0) {
      throw new ApiError(400, 'Could not extract text from this PDF. Ensure it contains selectable text.');
    }
    return text.trim();
  }

  // text/plain or text/markdown
  return buffer.toString('utf-8').trim();
}

module.exports = { extractText };
