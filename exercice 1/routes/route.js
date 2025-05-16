import express from "express"
const router = express.Router()
import bookController from "../controllers/controller.js";


router.post('/books',bookController.createBooks);
router.get('/books', bookController.getAllBooks);
router.get('/books/:id',bookController.getBookById);
router.put('/books/:id',bookController.updateBook);
router.delete ('/books/:id',bookController.deleteBook);


export default router;