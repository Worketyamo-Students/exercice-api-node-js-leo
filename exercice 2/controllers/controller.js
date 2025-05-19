const crypto=require("crypto")
const fs=require("fs")
const path = require("path");



const dbPath = path.join(__dirname, "../database.json");

const contactController = {
    createContact: (req, res) => {
        // Générer un nouvel identifiant unique à chaque création
        // const myArray = new Uint32Array(1);
        // crypto.getRandomValues(myArray);
        const identifiant = crypto.randomBytes(4).readUInt16BE(0);

        const newContact = {
            id: identifiant,
            name: req.body.name,
            number: req.body.number
        };

        // Lecture de la base de données
        function readDb() {
                const data = fs.readFileSync(dbPath, "utf-8");
                const db = JSON.parse(data);
                return db;
        }
        // Écriture dans la base de données
        function writeDb(data) {
            fs.writeFileSync(dbPath, JSON.stringify(data,null,2), 'utf-8');
        }

        const db = readDb();
        db.push(newContact);
        writeDb(db);
        res.status(201).json(newContact);
    },
    getAllContacts: (req, res) => {
          // Lecture de la base de données
        function readDb() {
                const data = fs.readFileSync(dbPath, "utf-8");
                const db = JSON.parse(data);
                return db;
        }
        const db = readDb();
        res.status(201).json(db)
    },
    getContactById: (req, res) => {
        const id = req.params.id;
        function readDb() {
                const data = fs.readFileSync(dbPath, "utf-8");
                const db = JSON.parse(data);
                return db;
        }
        const db = readDb();
        const contact = db.find(contact => String(contact.id) === String(id));
        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ error: `le contact dont l'id est ${id} n'existe pas` });
        }
    },
    updateContact: (req, res) => {
        const id = req.params.id;
        const newData = req.body;   
        
        function readDb() {
            const data = fs.readFileSync(dbPath, "utf-8");
            const db = JSON.parse(data);
            return db;
        }

        function writeDb(data) {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
        }

        let db = readDb();

        const index = db.findIndex(contact => String(contact.id) === String(id));
        if (index === -1) {
            return res.status(404).json({ message: 'Contact non trouvé' });
        }

        // mise à jour le contact
        db[index] = { ...db[index], ...newData };

        writeDb(db);

        res.json({ message: 'Contact mis à jour', contact: db[index] });
    },
    deleteContact: (req, res) => {

        const id = req.params.id;
        function readDb() {
            const data = fs.readFileSync(dbPath, "utf-8");
            const db = JSON.parse(data);
            return db;
        }
        function writeDb(data) {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
        }
        const db = readDb();
        const index = db.findIndex(contact => String(contact.id) === String(id));
        const contact = db.find(contact => String(contact.id) === String(id))
        if (index !== -1) {
            db.splice(index, 1);
            writeDb(db);
            console.log("supression de",contact.name,"bien effectué")
            // res.status(200).json(contact);
            // res.status(200).json(db)
        } else {
            res.status(404).json({ error: `le contact dont l'id est ${id} n'existe pas` });
        }
     
    },
    getStatus: (req, res) => {
         res.send("API is running");
    }
};


module.exports = contactController
