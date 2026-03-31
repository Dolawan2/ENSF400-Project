const { Router } = require('express');
const downloadController = require('../controllers/download.controller');

const router = Router();

router.get('/:generationId', downloadController.download);

module.exports = router;
