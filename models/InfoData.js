const mongoose = require('mongoose');


const infoDataSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  roomsAvailable: { type: Number, required: true },
  roomType: { type: String, required: true },
  price: { type: Number, required: true }
});


const InfoData = mongoose.model('InfoData', infoDataSchema);

module.exports = InfoData;
