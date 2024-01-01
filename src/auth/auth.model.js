const mongoose = require('mongoose');
const { generateId } = require('../utils/snowflake');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: generateId()
  },
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});




module.exports = {
  User: mongoose.model('User', userSchema),
};