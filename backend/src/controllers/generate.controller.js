const { generateStudyMaterial, regenerateStudyMaterial } = require('../services/llm.service');
const uploadQueries = require('../db/queries/uploads');
const genQueries = require('../db/queries/generations');
const ApiError = require('../utils/ApiError');

async function generate(req, res, next) {
  try {
    const { uploadId, questionType, numQuestions } = req.body;

    const upload = await uploadQueries.findById(uploadId);
    if (!upload) {
      throw new ApiError(404, 'Upload not found.');
    }
    if (upload.user_id !== req.user.userId) {
      throw new ApiError(403, 'Access denied.');
    }

    const result = await generateStudyMaterial(
      upload.extracted_text,
      questionType,
      numQuestions || 5
    );

    const generation = await genQueries.createGeneration(
      uploadId,
      req.user.userId,
      result.summary,
      result.structuredSummary,
      result.questionType,
      result.questions
    );

    res.status(201).json({ generation });
  } catch (err) {
    next(err);
  }
}

async function regenerate(req, res, next) {
  try {
    const { uploadId, questionType, numQuestions } = req.body;

    const upload = await uploadQueries.findById(uploadId);
    if (!upload) {
      throw new ApiError(404, 'Upload not found.');
    }
    if (upload.user_id !== req.user.userId) {
      throw new ApiError(403, 'Access denied.');
    }

    const result = await regenerateStudyMaterial(
      upload.extracted_text,
      questionType,
      numQuestions || 5
    );

    const generation = await genQueries.createGeneration(
      uploadId,
      req.user.userId,
      result.summary,
      result.structuredSummary,
      result.questionType,
      result.questions
    );

    res.status(201).json({ generation });
  } catch (err) {
    next(err);
  }
}

module.exports = { generate, regenerate };
