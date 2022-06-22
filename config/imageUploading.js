const cloudinary = require("cloudinary").v2;
const path = require("path");

require("dotenv").config({
   path: path.resolve(__dirname, "../config/.env"),
});

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;
