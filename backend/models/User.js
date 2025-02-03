const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  points: {
    type: Number,
    default: 0
  },
  lastGamePlayed: {
    type: Date
  }
});

module.exports = mongoose.model('User', userSchema);
