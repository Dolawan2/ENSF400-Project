const { Router } = require('express');
const Joi = require('joi');
const validate = require('../middleware/validate');
const userController = require('../controllers/user.controller');

const router = Router();

const updateProfileSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  email: Joi.string().email(),
}).min(1);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.get('/history', userController.getHistory);

module.exports = router;
