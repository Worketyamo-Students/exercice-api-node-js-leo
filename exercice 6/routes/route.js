const express = require('express');
const router = express.Router();
const convertController = require('../controllers/controller.js');
const multer = require('multer');
const upload = multer({ dest: 'tmp/' });
const os = require('os');


router.post('/convert', upload.single('file'),convertController.convertFile);
router.get('/convert/:id',convertController.downloadConverted);
router.put('/convert/:id',convertController.reprocessFile);
router.delete('/convert/:id',convertController.deleteConversion);
module.exports = router;
