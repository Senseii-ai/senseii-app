import mongoose from 'mongoose';

require('dotenv').config();

const url = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    if (!url)
      throw new Error(
        'MONGODB_URL is not defined in the environment variables'
      );
    await mongoose.connect(url);
    console.log('Connected to Database successful');
  } catch (error) {
    console.error('Error connecting to Database', error);
  }
};

export default connectDB;
