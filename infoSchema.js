const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    hostelName:{
        type:String,
        required:true
    },
    roomsAvail:{
        type:Number,
        required:true
    },
    roomType:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imgUrl:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('info',infoSchema)