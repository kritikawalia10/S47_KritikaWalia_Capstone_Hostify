const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Rejected'], default: 'Pending' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
