import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/phishguard';
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 800,
      connectTimeoutMS: 800
    });
    isMongoConnected = true;
    console.log('🟢 [MongoDB] Connected to database successfully');
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ [MongoDB Warning] Unable to connect to MongoDB (${error.message}). Operating in Resilient In-Memory Storage mode.`);
  }
};

export const getDBStatus = () => {
  return {
    provider: isMongoConnected ? 'MongoDB (Mongoose)' : 'In-Memory Resilient Store',
    connected: isMongoConnected,
    state: mongoose.connection.readyState === 1 ? 'connected' : 'fallback-active'
  };
};

export const isDbConnected = () => isMongoConnected;
