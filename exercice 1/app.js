import express from "express"
import router from "./routes/route.js";
import bodyParser from "body-parser";
// import bookController from "./controllers/controller.js"
const app =express()
let port =3001

app.use(bodyParser.json())
app.use("/", router)

app.listen(port,(error)=>{

    console.log(`le serveur tourne sur le port ${port}`)
})

