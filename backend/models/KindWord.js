const mongoose = require('mongoose');

const kindWordSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('KindWord', kindWordSchema);
