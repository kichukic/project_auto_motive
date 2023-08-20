import express from "express";
import http from "http"
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import {Server} from  "socket.io"
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import sensors from "./API/sensor.mjs";
import db from "./Database/db.mjs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicFolderPath = path.join(__dirname, "public");
dotenv.config();

app.use(express.static(publicFolderPath));
app.use(bodyParser.json());
app.use(cors());
app.use("/sensors", sensors);

const httpServer = http.createServer(app);
const io = new Server(httpServer)

io.on("connection",(socket)=>{
    console.log("a user connected")
    
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });

})


app.get("/home", (req, res) => {
  res.sendFile(path.join(publicFolderPath, "index.html"));
});

httpServer.listen(process.env.port, () => {
  console.log(`server is running on port ${process.env.port}`);
});

export {io}