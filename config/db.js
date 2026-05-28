import mongoose from 'mongoose';

const withDatabaseName = (uri) => {
  if (!process.env.MONGODB_DB) return uri;

  const parsed = new URL(uri);
  if (parsed.pathname && parsed.pathname !== '/') return uri;

  parsed.pathname = `/${process.env.MONGODB_DB}`;
  return parsed.toString();
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('Missing MONGODB_URI or MONGO_URI environment variable');
    }

    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(withDatabaseName(mongoUri), {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
