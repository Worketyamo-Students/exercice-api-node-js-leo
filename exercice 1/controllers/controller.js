import fs, { readFileSync } from "fs";
// import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../database.json");

function readDb() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  const db = JSON.parse(data || '{}');
  if (!Array.isArray(db.books)) {
    db.books = [];
  }
  return db;
}
function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

const bookController = {
    createBooks: (req, res) => {
    const db = readDb();
    const newBook = {
    id:uuidv4(),
    title: req.body.title,
    author: req.body.author
    };

    db.books.push(newBook);
    writeDb(db);

    res.status(201).json(newBook);
},
    // read all
    getAllBooks: (req, res) => {
        const db = readDb();
        res.json(db.books); 
},
getBookById: (req, res) => {
  const id = req.params.id;
  const db = readDb();
  const book = db.books.find(objet => objet.id === id);//recherche dans le tableau un objet par son id
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: `le livre avec l'ID ${id} n'existe pas` });
  }
},
  updateBook: (req, res) => {
    const id = req.params.id;
    const db = readDb();
    const bookIndex = db.books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
      const updatedBook = {
        ...db.books[bookIndex],
        ...req.body,
        id: db.books[bookIndex].id 
      };
      db.books[bookIndex] = updatedBook;
      writeDb(db);
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: `Le livre avec l'ID ${id} n'existe pas` });
    }
  },
deleteBook: (req, res) => {
  const id = req.params.id;
  const db = readDb();
  const index = db.books.findIndex(objet => objet.id === id);
  if (index !== -1) {
    db.books.splice(index, 1); // supprime 1 élément à la position `index`
    writeDb(db);
    res.json({ message: `Le livre avec l'ID ${id} a bien été supprimé`});
  } else {
    res.status(404).json({ error: `Le livre avec l'ID "${id}" n'existe pas` });
  }
}
};
export default bookController;

