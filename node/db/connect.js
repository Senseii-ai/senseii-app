const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to Database successful');
  } catch (error) {
    console.error('Error connecting to Database', error);
  }
};

module.exports = connectDB;
