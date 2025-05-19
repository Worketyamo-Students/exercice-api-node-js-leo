const express=require('express');
const router =require('./routes/route.js')
// const bodyParser=require("body-parser")

const app=express();
const port=3002
// app.use(bodyParser.json())
app.use(express.json())
app.use('/', router)


app.listen(port,()=>{
    console.log(`le seveur tourne sur le port ${port}`)
})
