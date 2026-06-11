const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  roomsAvail: { type: Number, required: true },
  roomType: { type: String, required: true },
  price: { type: Number, required: true },
  imgUrl: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hostel', hostelSchema);
