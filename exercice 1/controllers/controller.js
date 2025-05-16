import fs, { readFileSync } from "fs";
// import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../database.json");

function readDb() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}
function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

const bookController = {
    createBooks: (req, res) => {
    const db = readDb();
    const newBook = {
    id:db.books.length + 1,
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

    // read get by id
    getBookById: (req, res) => {
        res.status(200).json({ message: `ceci est le livre dont l'id est : ${req.body.id}` });
    },
    updateBook: (req, res) => {
        res.status(200).json({ message: 'update book' });
    },
    deleteBook: (req, res) => {
        res.status(200).json({ message: 'delete book' });
    }
};

export default bookController;