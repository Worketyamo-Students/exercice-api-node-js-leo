const fs=require("fs");
const path =require("path");
const stream =require("stream");
const crypto =require("crypto");
const uuid=require("uuid");
const multer=require("multer")
const os = require('os');
const { Transform } = require('stream');
// const upload=multer({dest:'uploads/'});

// const upload = multer({ dest: os.tmpdir() });
const random=crypto.randomUUID()


const dbPath = path.join(__dirname, "../database.json");
const csvPath = path.join(__dirname, "../database.csv");


const convertController={
    convertFile:(req,res)=>{
        if(req.file){
            const extName=path.extname(req.file.originalname)
            const newPath=path.join('uploads',`${random}${extName}`);
            // console.log(random)
            fs.rename(req.file.path,newPath,(err)=>{
                res.status(500).send('erreur interne au serveur')
            })
            // res.send(`le chemin temporaire est ${req.file.path}`)
            res.send(`le nouveau chemin est ${newPath}`)
            console.log(`entretemps le nouveau nom du fichier c'est ${newPath}`)
            const fileType=req.file.mimetype
            console.log(req.file.mimetype)
            // transformons en majuscule
            // sauf que ca ne marche que pour les fichier .txt,.csv et .json
            if(fileType===`text/plain`|| fileType===`text/csv`|| fileType===`application/json`){
                console.log('test reuissit pour le fichier')
                // convertissons le donc
                // sauf que c'est sans utiliser  fs.createReadStream  comme demande la consigne
                const data = fs.readFileSync(newPath, "utf-8");
                const maj=data.toUpperCase()
                const writeMaj=fs.writeFileSync("testMaj.txt",maj,"utf-8")
                console.log(maj)
            }
            else{
                res.status(400).send("ce type de fichier ne peut pas etre transformer en majuscule")
            }
        }else{
            res.status(400).send("erreur interne au serveur")
        }
        // res.send("convert file");
    },
    downloadConverted:()=>{

    },
    reprocessFile:()=>{

    },
    deleteConversion:()=>{

    }
}




module.exports=convertController