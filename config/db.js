import mongoose from 'mongoose';

const withDatabaseName = (uri) => {
  if (!process.env.MONGODB_DB) return uri;

  const parsed = new URL(uri);
  if (parsed.pathname && parsed.pathname !== '/') return uri;

  parsed.pathname = `/${process.env.MONGODB_DB}`;
  return parsed.toString();
};

const connectDB = async (retryCount = 5, delayMs = 5000) => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('CRITICAL: Missing MONGODB_URI or MONGO_URI environment variable');
  }

  mongoose.set('strictQuery', true);

  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB: Reusing existing database connection.');
    return;
  }

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const conn = await mongoose.connect(withDatabaseName(mongoUri), {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB Connection Attempt ${attempt}/${retryCount} Failed: ${error.message}`);
      if (attempt === retryCount) {
        throw new Error('CRITICAL: MongoDB connection failed after maximum retries.');
      }
      console.log(`Retrying database connection in ${delayMs / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs = delayMs * 1.5;
    }
  }
};

export default connectDB;
