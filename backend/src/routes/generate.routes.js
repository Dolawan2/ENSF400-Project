const { Router } = require('express');
const Joi = require('joi');
const validate = require('../middleware/validate');
const generateController = require('../controllers/generate.controller');

const router = Router();

const generateSchema = Joi.object({
  uploadId: Joi.string().uuid().required(),
  questionType: Joi.string().valid('multiple_choice', 'short_answer').required(),
  numQuestions: Joi.number().integer().min(1).max(20).default(5),
});

router.post('/', validate(generateSchema), generateController.generate);
router.post('/regenerate', validate(generateSchema), generateController.regenerate);

module.exports = router;
