const { Router } = require('express');
const Joi = require('joi');
const validate = require('../middleware/validate');
const adminController = require('../controllers/admin.controller');

const router = Router();

const updateUserSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid('student', 'admin'),
}).min(1);

router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', validate(updateUserSchema), adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
