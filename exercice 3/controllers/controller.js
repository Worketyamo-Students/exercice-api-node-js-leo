const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../database.json");
const csvPath = path.join(__dirname, "../database.csv");


function readDb() {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
}

function writeDb(data) { 
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    syncCSV(data)
}
const syncCSV = (events) => {
  const csv = ["id,title,date"]
    .concat(
      events.map(
        (event) => `${event.id},${event.title},${event.date}`
      )
    )
    .join("\n");
  fs.writeFileSync(csvPath, csv);
};

const eventController = {
    createEvent: (req, res) => {
        try {
            const db = readDb();
            const newEvent = {
            id: crypto.randomUUID(),
            title: req.body.title,
            date: req.body.date
        };
        db.push(newEvent);
        writeDb(db);  
        res.status(201).json(newEvent);

        } catch (error) {
            res.status(500).json("erreur de serveur")
            
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
            try {
    const id = req.params.id;
    const newData = req.body;
    let db = readDb();

    const index = db.findIndex(event => event.id === id);
    if (index === -1) {
      return res.status(404).json({ message: `L'événement avec l'ID ${id} n'existe pas.` });
    }


    db[index] = { ...db[index], ...newData };
    writeDb(db);

    return res.status(200).json({ event: db[index] });
    
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ error: "Erreur lors de la mise à jour" });
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
        
        writeDb(db);
        console.log("suppression réussit...");
        res.status(200).json({ message: "événement supprimé avec succès" });

    },
    
    compressLogs:(req,res)=>{
        res.send('ici faudra faire de la compression')
    }
};

module.exports = eventController;   