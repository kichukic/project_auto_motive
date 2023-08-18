import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

import sensors from "./API/sensor.mjs"
import db from "./Database/db.mjs"
const app = express();
dotenv.config();



app.use(bodyParser.json());
app.use(cors());
app.use("/sensors",sensors)



app.listen(process.env.port,()=>{
    console.log(`server is running on port ${process.env.port}`)
})