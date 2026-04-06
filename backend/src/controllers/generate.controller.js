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

    const startedAt = Date.now();
    const result = await generateStudyMaterial(
      upload.extracted_text,
      questionType,
      numQuestions || 5
    );
    const elapsedSeconds = (Date.now() - startedAt) / 1000;
    logGenerationDuration('generate', elapsedSeconds, result.durationSeconds);

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

    const startedAt = Date.now();
    const result = await regenerateStudyMaterial(
      upload.extracted_text,
      questionType,
      numQuestions || 5
    );
    const elapsedSeconds = (Date.now() - startedAt) / 1000;
    logGenerationDuration('regenerate', elapsedSeconds, result.durationSeconds);

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

function logGenerationDuration(label, nodeElapsed, llmDuration) {
  const llmText = typeof llmDuration === 'number' ? `${llmDuration.toFixed(3)}s` : 'n/a';
  const line = `[${label}] node=${nodeElapsed.toFixed(3)}s llm=${llmText}`;
  if (nodeElapsed > 50) {
    console.warn(`${line} — near 60s timeout`);
  } else if (nodeElapsed > 30) {
    console.warn(`${line} — slow generation`);
  } else {
    console.log(line);
  }
}

module.exports = { generate, regenerate };
