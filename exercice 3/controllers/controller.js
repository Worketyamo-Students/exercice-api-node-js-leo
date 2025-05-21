const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../database.json");


function readDb() {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
}

function writeDb(data) { 
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

const eventController = {
    createEvent: (req, res) => {
        const newEvent = {
            id: db.length+1,
            title: req.body.title,
            date: req.body.date
        };
        const db = readDb();
        db.push(newEvent);
        
        if (writeDb(db)) {
            res.status(201).json(newEvent);
        } 
    },

    getAllEvents: (req, res) => {
        const db = readDb();
        res.status(200).json(db);
    },

    getEventById: (req, res) => {
        const id = req.params.id;
        const db = readDb();
        const event = db.find(event => event.id === id);
        
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ error: `l'événement avec l'ID ${id} n'existe pas` });
        }
    },

    updateEvent: (req, res) => {
            const id = req.params.id;
            const newData = req.body;
            let db = readDb();

            const index = db.findIndex(event => event.id === id);
            if (index === -1) {
                return res.status(404).json({ message: `l'evenement dont l'id est ${id} n'esxite pas dans la bd ` });
            }

            db[index] = { ...db[index], ...newData };

            if (writeDb(db)) {
                res.json({event: db[index] });
            } else {
                res.status(500).json({ error: "erreur lors de la mise à jour" });
            }
    },

    deleteEvent: (req, res) => {

            const id = req.params.id;
            let db = readDb();
            const index = db.findIndex(event => event.id === id);
            
            if (index === -1) {
                return res.status(404).json({ error: `l'événement avec l'ID ${id} n'existe pas` });
            }

            const [deletedEvent] = db.splice(index, 1);
            
            if (writeDb(db)) {
                console.log("suppression de l'evenement", deletedEvent.title, "a été bien effectuée");
                res.status(200).json({ message: "evénement supprimé avec succès" });
            }
    },
    
    compressLogs:(req,res)=>{
        req.send('ici faudra faire de la compression')
    }
};

module.exports = eventController;