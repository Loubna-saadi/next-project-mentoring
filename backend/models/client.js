const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new mongoose.Schema({
  // Fields from the UserBase
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, enum: ['mentor', 'client'], default: 'client' },
  photo: { type: String } ,
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  }],
});

module.exports = mongoose.model('Client', ClientSchema);
