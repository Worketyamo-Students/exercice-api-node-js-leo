const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../database.json");
const csvPath = path.join(__dirname, "../database.csv");


function readDb() {
    const data = fs.existsSync(dbPath) ? fs.readFileSync(dbPath, "utf-8") : "[]";
    return JSON.parse(data);
}

function writeDb(data) { 
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    syncCSV(data)
}
function syncCSV(products) {
    const csv = ["id,name,mark"]
        .concat(products.map(product => `${product.id},${product.name},${product.mark}`))
        .join("\n");
    fs.writeFileSync(csvPath, csv);
}

const productController = {
    createProduct: (req, res) => {
        const db = readDb();
        const newProduct = {
            id: crypto.randomBytes(3).toString('hex'),
            name: req.body.name,
            mark: req.body.mark
        };
        db.push(newProduct);

        writeDb(db);
        res.status(201).json(newProduct);
    },

    getAllProducts: (req, res) => {
        const db = readDb();
        res.status(200).json(db);
    },

    getProductById: (req, res) => {
        const id = req.params.id;
        const db = readDb();
        const product = db.find(product => product.id === id);
        
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: `l'événement avec l'ID ${id} n'existe pas` });
        }
    },

    updateProduct: (req, res) => {
            const id = req.params.id;
            const newData = req.body;
            let db = readDb();

            const index = db.findIndex(product => product.id === id);
            if (index === -1) {
                return res.status(404).json({ message: `l'evenement dont l'id est ${id} n'esxite pas dans la bd ` });
            }

            db[index] = { ...db[index], ...newData };

            if (writeDb(db)) {
                res.json({product: db[index] });
            } else {
                res.status(500).json({ error: "erreur lors de la mise à jour" });
            }
    },

    deleteProduct: (req, res) => {

            const id = req.params.id;
            let db = readDb();
            const index = db.findIndex(product => product.id === id);
            
            if (index === -1) {
                return res.status(404).json({ error: `l'événement avec l'ID ${id} n'existe pas` });
            }

            const [deletedProduct] = db.splice(index, 1);
            
            if (writeDb(db)) {
                console.log("suppression de l'evenement", deletedProduct.title, "a été bien effectuée");
                res.status(200).json({ message: "evénement supprimé avec succès" });
            }
    },
    
    getProductsWithPromos:(req,res)=>{
        req.send('ici on verra ca apres')
    }
};

module.exports = productController;