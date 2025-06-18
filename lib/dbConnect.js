// lib/dbConnect.js
import mongoose from 'mongoose';

const connectDB = async () => {

  //console.log("MONGODB_URI:", process.env.MONGODB_URI);
const MONGODB_URI = process.env.MONGO_URI;
  try {
    if (mongoose.connection.readyState === 1) return;

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
