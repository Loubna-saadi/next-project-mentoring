const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  // Fields from the UserBase
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, enum: ['mentor', 'client'], default: 'client' },
  photo: { 
    type: String 
  } ,
  // Fields for mentors only
  category: {
    type: [String], // Array of categories
    required: true,
  },
  about: {
    type: String,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  YearsInbusiness:{
    type: Number,
    default: 0,
  },
  NumberOfMentees:{
    type: Number,
    default: 0,
  },
  YearsOfMentoring:{
    type: Number,
    default: 0,
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
  }],
});

module.exports = mongoose.model('Mentor', MentorSchema);
