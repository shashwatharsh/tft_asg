const mongoose = require('mongoose');
const { generateId } = require('../utils/snowflake')

const memberSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
      default: generateId()
    },
    community: {
      type: String,
      required: true,
      ref: 'Community',
    },
    user: {
      type: String,
      required: true,
      ref: 'User',
    },
    role: {
      type: String,
      required: true,
      ref: 'Role',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  });
  
module.exports = {
    Member: mongoose.model('Member', memberSchema)
};