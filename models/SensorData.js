import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema(
    {
      distance: {
        type: Number,
        required: true,
      },
      polyhouseId:{
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now, // Automatically add a timestamp
      },
    },
    { versionKey: false }
  );

export const SensorData = mongoose.model("SensorData", sensorDataSchema);