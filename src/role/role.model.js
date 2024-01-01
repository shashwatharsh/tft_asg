const mongoose = require('mongoose');
const { generateId } = require('../utils/snowflake');


const roleSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
      default: generateId()
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: null,
    },
  });
  

  module.exports = {
    Role: mongoose.model('Role', roleSchema)
  };