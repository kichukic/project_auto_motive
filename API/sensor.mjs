import express from "express";
 const router = express.Router();
 import { io } from "../automotive.mjs";
 import {Server} from  "socket.io"
 import { sensordata } from "../models/sensorData.mjs";
 import { parseISO } from "date-fns";


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

        await sensordata.find().sort({_id: -1}).limit(25).then((data)=>{
          data.map((item)=>{
            rpm.push(item.rpm)
            temp1.push(item.temp1)
            temp2.push(item.temp2)
            temp3.push(item.temp3)
            pressure.push(item.pressure)
           // console.log(item.time)
            let epoch = new Date(item.time * 1000);
          let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
          let formatted = epoch.toLocaleString('en-US', options);
          formattedDate.push(formatted);  
          console.log(" > >>> > > > > ++ +++++",formatted)
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
    const pageSize = parseInt(req.query.pageSize) || 25; // Get the page size from the query, default to 20

    // Calculate skip value based on page and pageSize
    const skip = page * pageSize;
   // console.log("the page number receiving   > >> > > > >",page)

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
        //  console.log(item.time)
          let epoch = new Date(item.time * 1000);
        let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        let formatted = epoch.toLocaleString('en-US', options);
        formattedDate.push(formatted); 
        })
      })
    return  res.status(200).json({rpm,temp1,temp2,temp3,pressure,formattedDate})
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


router.get("/getDataByDateRange", async (req, res) => {
  try {
    let rpm = []
    let temp1 = []
    let temp2 = []
    let temp3 = []
    let pressure = []
    let formattedDate = []
    const page = parseInt(req.query.page) || 0; // Get the page number from the query, default to 0
    const pageSize = parseInt(req.query.pageSize) || 50; // Get the page size from the query, default to 20
    const skip = page * pageSize;
       const fromDate = req.query.from // Convert string to Date object
       const toDate = req.query.to; // Convert string to Date object
        console.log(" > >> >",fromDate,"and",toDate)
      // Fetch data from the database within the specified date range
      const data = await sensordata.find({
          time: { $gte: fromDate, $lte: toDate }
      }).sort({ time: 1 }).skip(skip).limit(pageSize).then((data)=>{
        console.log(" + + ++  +",)
        data.map((item)=>{
          rpm.push(item.rpm)
          temp1.push(item.temp1)
          temp2.push(item.temp2)
          temp3.push(item.temp3)
          pressure.push(item.pressure)
        //  console.log(item.time)
          let epoch = new Date(item.time * 1000);
        let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        let formatted = epoch.toLocaleString('en-US', options);
        formattedDate.push(formatted); 
        })
      })
        return  res.status(200).json({rpm,temp1,temp2,temp3,pressure,formattedDate})
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/getDataByThreshold", async (req, res) => {
  try {
    // Retrieve the values of query parameters, including potential MongoDB query operators
    const thresholds = {
      rpm: parseFloat(req.query.filter.rpm),
      temp1: parseFloat(req.query.filter.temp1),
      temp2: parseFloat(req.query.filter.temp2),
      temp3: parseFloat(req.query.filter.temp3),
      pressure: parseFloat(req.query.filter.pressure),
    };
    
    // Create a filter object based on the provided threshold values
    const filter = {};

    if (!isNaN(thresholds.rpm)) {
      filter.rpm = { $gte: thresholds.rpm };
    }

    if (!isNaN(thresholds.temp1)) {
      filter.temp1 = { $gte: thresholds.temp1 };
    }

    if (!isNaN(thresholds.temp2)) {
      filter.temp2 = { $gte: thresholds.temp2 };
    }

    if (!isNaN(thresholds.temp3)) {
      filter.temp3 = { $gte: thresholds.temp3 };
    }

    if (!isNaN(thresholds.pressure)) {
      filter.pressure = { $gte: thresholds.pressure };
    }

    // Calculate pagination parameters
    const page = parseInt(req.query.page) || 0; // Get the page number from the query, default to 0
    const pageSize = parseInt(req.query.pageSize) || 25; // Get the page size from the query, default to 25
    const skip = page * pageSize; // Calculate skip value based on page and pageSize

    // Fetch paginated data from the database based on the filter
    const data = await sensordata
      .find(filter)
      .sort({ time: 1 })
      .skip(skip)
      .limit(pageSize);

    // Extract data and respond with the paginated filtered data
    const filteredData = {
      formattedDate: [],
      rpm: [],
      temp1: [],
      temp2: [],
      temp3: [],
      pressure: [],
    };

    data.forEach((item) => {
      filteredData.rpm.push(item.rpm);
      filteredData.temp1.push(item.temp1);
      filteredData.temp2.push(item.temp2);
      filteredData.temp3.push(item.temp3);
      filteredData.pressure.push(item.pressure);

      let epoch = new Date(item.time * 1000);
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      let formatted = epoch.toLocaleString("en-US", options);
      filteredData.formattedDate.push(formatted);
    });

    // Check if any of the thresholds are valid
    const validThresholds = Object.keys(thresholds).filter((key) => !isNaN(thresholds[key]));

    // If there are valid thresholds, return data for those fields along with pagination info
    if (validThresholds.length > 0) {
      const response = {
        formattedDate: filteredData.formattedDate,
      };

      validThresholds.forEach((field) => {
        response[field] = filteredData[field];
      });

      // Include pagination information in the response
      response.pagination = {
        page: page,
        pageSize: pageSize,
        totalCount: await sensordata.countDocuments(filter),
      };

      return res.status(200).json(response);
    }

    // If no valid thresholds are provided, return an empty response
    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});




export default router