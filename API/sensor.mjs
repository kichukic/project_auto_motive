import express from "express";
 const router = express.Router();
 import { sensordata } from "../models/sensorData.mjs";


router.post("/data",async(req,res)=>{
 try {
    const SnsrDat = req.body;
    if(!SnsrDat.data||!Object.values(SnsrDat.data).every(param=>param)){
      return res.status(400).json({messgae : "no data or some parameters missed"})
    }
  if(SnsrDat.data){
  await sensordata.create(SnsrDat.data)
  return res.status(200).json({messgae : "data inserted sucessfully"})
  }
 
  
 } catch (error) {
    console.log(error)
    return res.status(500).json({messgae : "internal server error"})
 }
})


router.get("/getData",async(req,res)=>{
    try {
        await sensordata.find().then((data)=>{
            return res.status(200).json(data)
        })
    } catch (error) {
        
    }
})


export default router