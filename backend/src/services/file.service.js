const pdfParse = require('pdf-parse');
const ApiError = require('../utils/ApiError');

async function extractText(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    if (!data.text || data.text.trim().length === 0) {
      throw new ApiError(400, 'Could not extract text from this PDF. Ensure it contains selectable text.');
    }
    return data.text.trim();
  }

  // text/plain or text/markdown
  return buffer.toString('utf-8').trim();
}

module.exports = { extractText };
