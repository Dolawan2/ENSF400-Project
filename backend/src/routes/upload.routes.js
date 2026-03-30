const { Router } = require('express');
const upload = require('../middleware/upload');
const uploadController = require('../controllers/upload.controller');

const router = Router();

router.post('/', upload.single('file'), uploadController.uploadFile);
router.get('/', uploadController.listUploads);
router.get('/:id', uploadController.getUpload);
router.delete('/:id', uploadController.deleteUpload);

module.exports = router;
