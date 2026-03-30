const axios = require('axios');
const config = require('../config');
const ApiError = require('../utils/ApiError');

async function generateStudyMaterial(notesText, questionType, numQuestions = 5) {
  try {
    const response = await axios.post(
      `${config.llm.baseUrl}/generate/`,
      { notesText, questionType, numQuestions },
      { timeout: 60000 }
    );
    return response.data;
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      throw new ApiError(503, 'LLM service is unavailable.');
    }
    if (err.code === 'ECONNABORTED') {
      throw new ApiError(408, 'Generation timed out. Try with shorter notes.');
    }
    if (err.response) {
      throw new ApiError(err.response.status, err.response.data?.detail || 'LLM service error.');
    }
    throw new ApiError(502, 'LLM service error.');
  }
}

async function regenerateStudyMaterial(notesText, questionType, numQuestions = 5) {
  try {
    const response = await axios.post(
      `${config.llm.baseUrl}/generate/regenerate`,
      { notesText, questionType, numQuestions },
      { timeout: 60000 }
    );
    return response.data;
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      throw new ApiError(503, 'LLM service is unavailable.');
    }
    if (err.code === 'ECONNABORTED') {
      throw new ApiError(408, 'Generation timed out. Try with shorter notes.');
    }
    if (err.response) {
      throw new ApiError(err.response.status, err.response.data?.detail || 'LLM service error.');
    }
    throw new ApiError(502, 'LLM service error.');
  }
}

module.exports = { generateStudyMaterial, regenerateStudyMaterial };
