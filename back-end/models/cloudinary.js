const cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: 'ddxsmyfve',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

module.exports = cloudinary;