import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

mongoose.connect(process.env.mongo_uri,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("database connected")
}).catch((error)=>{
    console.log("database not connected" , error)
})





export default mongoose