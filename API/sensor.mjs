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
      let rpm = []
      let temp1 = []
      let temp2 = []
      let temp3 = []
      let pressure = []

        await sensordata.find().then((data)=>{
          data.map((item)=>{
            rpm.push(item.rpm)
            temp1.push(item.temp1)
            temp2.push(item.temp2)
            temp3.push(item.temp3)
            pressure.push(item.pressure)
          })
           console.log(rpm,temp1,temp2,temp3,pressure)
        })
        res.status(200).json({rpm,temp1,temp2,temp3,pressure})
    } catch (error) {
        console.log(error)
    }
})



export default router