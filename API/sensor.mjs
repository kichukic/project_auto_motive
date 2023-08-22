import express from "express";
 const router = express.Router();
 import { io } from "../automotive.mjs";
 import {Server} from  "socket.io"
 import { sensordata } from "../models/sensorData.mjs";


router.post("/data",async(req,res)=>{
 try {
    const SnsrDat = req.body;
    if(!SnsrDat.data||!Object.values(SnsrDat.data).every(param=>param)){
      return res.status(400).json({messgae : "no data or some parameters missed"})
    }
  if(SnsrDat.data){
    if(SnsrDat.data.time || SnsrDat.data.time === null || SnsrDat.data.time === undefined){
    SnsrDat.data.time = Date.now() / 1000
   new Date(SnsrDat.data.time * 1000); // i know weird , but works
    }
  await sensordata.create(SnsrDat.data)
  io.emit("dataPosted",)
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
      let formattedDate = []

        await sensordata.find().sort({_id: -1}).limit(20).then((data)=>{
          data.map((item)=>{
            rpm.push(item.rpm)
            temp1.push(item.temp1)
            temp2.push(item.temp2)
            temp3.push(item.temp3)
            pressure.push(item.pressure)
            console.log(item.time)
            let epoch = new Date(item.time * 1000);
          let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
          let formatted = epoch.toLocaleString('en-US', options);
          formattedDate.push(formatted);  
          })
           console.log(rpm,temp1,temp2,temp3,pressure,formattedDate)
        })
        res.status(200).json({rpm,temp1,temp2,temp3,pressure,formattedDate})
    } catch (error) {
        console.log(error)
    }
})



// Inside your API router file

router.get("/getDatByPage", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // Get the page number from the query, default to 0
    const pageSize = parseInt(req.query.pageSize) || 20; // Get the page size from the query, default to 20

    // Calculate skip value based on page and pageSize
    const skip = page * pageSize;
    console.log("the page number receiving   > >> > > > >",page)

    let rpm = []
    let temp1 = []
    let temp2 = []
    let temp3 = []
    let pressure = []
    let formattedDate = []

    // Fetch data with pagination using the skip and limit values
       await sensordata
      .find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize).then((data)=>{
        data.map((item)=>{
          rpm.push(item.rpm)
          temp1.push(item.temp1)
          temp2.push(item.temp2)
          temp3.push(item.temp3)
          pressure.push(item.pressure)
          console.log(item.time)
          let epoch = new Date(item.time * 1000);
        let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        let formatted = epoch.toLocaleString('en-US', options);
        formattedDate.push(formatted); 
        })
      })
    return  res.status(200).json({rpm,temp1,temp2,temp3,pressure,formattedDate})
    // Process the data as needed
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/clearData", async (req, res) => {
  try {
    await sensordata.deleteMany({}); // Delete all documents in the collection
    io.emit("dataCleared"); // Emit an event to indicate data clearance
    return res.status(200).json({ message: "Data cleared successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



export default router