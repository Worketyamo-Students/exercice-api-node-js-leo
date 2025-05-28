const express =require("express");
const bodyParser=require("body-parser");
const router=require("./routes/route.js");
const app=express();

const port =3006;

app.use(express.json());
app.use("/",router);
app.listen(port,()=>{
    console.log(`notre serveur tourne sur le port ${port}`)
});