import mongoose from "mongoose";

const newmodel =  new mongoose.Schema({
    deviceId:{
        type:String,
        required:true
    },
    temp1:{
        type:String,
        required:true
    },
    temp2:{
        type:String,
        required:true
    },
    temp3:{
        type:String,
        required:true
    },
    rpm:{
        type:String,
        required:true
    },
    pressure:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
})

const sensordata = mongoose.model("sensordata",newmodel);

export {sensordata}