import mongoose from "mongoose";

const newmodel =  new mongoose.Schema({
    deviceId:{
        type:String,
        required:true
    },
    temp1:{
        type:Number,
        required:true
    },
    temp2:{
        type:Number,
        required:true
    },
    temp3:{
        type:Number,
        required:true
    },
    rpm:{
        type:Number,
        required:true
    },
    pressure:{
        type:Number,
        required:true
    },
    time:{
        type:Number,
        required:true
    }
})

const sensordata = mongoose.model("sensordata",newmodel);

export {sensordata}