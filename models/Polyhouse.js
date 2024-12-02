import mongoose from "mongoose";

const polyhouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      coordinates: {
        latitude: { type: Number},
        longitude: { type: Number},
      },
      address: { type: String, required: true }, // Optional descriptive address
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    crops: [
      {
        cropName: { type: String, required: true },
        optimalTemperature: { min: Number, max: Number },
        optimalHumidity: { min: Number, max: Number },
        plantingDate: { type: Date },
        harvestDate: { type: Date },
      },
    ],
    configuration: {
      temperatureRange: { min: Number, max: Number },
      humidityRange: { min: Number, max: Number },
      additionalSettings: { type: Map, of: String }, // Allows dynamic configurations.
    },
    status: { type: String, enum: ["active", "maintenance"], default: "active" },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Polyhouse = mongoose.model('Polyhouse', polyhouseSchema);
export default Polyhouse;