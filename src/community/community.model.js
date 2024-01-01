const mongoose = require('mongoose');
const { generateId } = require('../utils/snowflake');


const communitySchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
      default: generateId()
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: String,
      required: true,
      ref: 'User',
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
    Community: mongoose.model('Community', communitySchema)
};