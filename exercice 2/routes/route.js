const express = require('express');
const router = express.Router();
const contactController = require('../controllers/controller.js');



router.post('/contacts' , contactController.createContact);
router.get('/contacts' , contactController.getAllContacts);
router.get('/contacts/:id' , contactController.getContactById);
router.put('/contacts/:id' , contactController.updateContact);
router.delete('/contacts/:id' , contactController.deleteContact);
router.get('/status' , contactController.getStatus);



module.exports = router