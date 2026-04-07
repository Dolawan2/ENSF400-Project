const axios = require('axios');
const https = require('https');
const config = require('../config');
const ApiError = require('../utils/ApiError');

// The LLM service is on the same host with a self-signed cert. Disable
// chain verification only for this internal client so the dev cert is accepted.
const llmClient = axios.create({
  baseURL: config.llm.baseUrl,
  timeout: 60000,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

async function generateStudyMaterial(notesText, questionType, numQuestions = 5) {
  try {
    const response = await llmClient.post('/generate/', { notesText, questionType, numQuestions });
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
    const response = await llmClient.post('/generate/regenerate', { notesText, questionType, numQuestions });
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
