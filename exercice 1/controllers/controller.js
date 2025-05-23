import fs, { readFileSync } from "fs";
// import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../database.json");
const csvPath = path.join(__dirname, "../database.csv");

function readDb() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  const db = JSON.parse(data || "[]");
  if (!Array.isArray(db)) {
    db = [];
  }
  return db;
}
function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  syncCSV(data)
}
const syncCSV=(book)=>{
  const csv = ["id,title,author"]
  .concat(
    book.map(
      (book)=>`${book.id},${book.title},${book.author}`
    )
  )
  .join("\n")
  fs.writeFileSync(csvPath,csv)
}

const bookController = {
    createBooks: (req, res) => {
    const db = readDb();
    const newBook = {
    id:uuidv4(),
    title: req.body.title,
    author: req.body.author
    };

    db.push(newBook);
    writeDb(db);

    res.status(201).json(newBook);
},
    // read all
    getAllBooks: (req, res) => {
        const db = readDb();
        res.json(db); 
},
getBookById: (req, res) => {
  const id = req.params.id;
  const db = readDb();
  const book = db.find(objet => objet.id === id);//recherche dans le tableau un objet par son id
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: `le livre avec l'ID ${id} n'existe pas` });
  }
},
  updateBook: (req, res) => {
    const id = req.params.id;
    const db = readDb();
    const bookIndex = db.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
      const updatedBook = {
        ...db[bookIndex],
        ...req.body,
        id: db[bookIndex].id 
      };
      db[bookIndex] = updatedBook;
      writeDb(db);
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: `Le livre avec l'ID ${id} n'existe pas` });
    }
  },
deleteBook: (req, res) => {
  const id = req.params.id;
  const db = readDb();
  const index = db.findIndex(objet => objet.id === id);
  if (index !== -1) {
    db.splice(index, 1); // supprime 1 élément à la position `index`
    writeDb(db);
    res.json({ message: `Le livre avec l'ID ${id} a bien été supprimé`});
  } else {
    res.status(404).json({ error: `Le livre avec l'ID "${id}" n'existe pas` });
  }
}
};
export default bookController;

