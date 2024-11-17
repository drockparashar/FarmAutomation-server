import mongoose from 'mongoose';
import { InfluxDB } from '@influxdata/influxdb-client';
import dotenv from './dotenv.js';

dotenv.config();

const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const influxConnect = () => {
  const client = new InfluxDB({ url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN });
  console.log('Connected to InfluxDB');
  return client;
};

export { mongoConnect, influxConnect };
