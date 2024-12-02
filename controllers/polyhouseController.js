import Polyhouse from '../models/Polyhouse.js';

import { authenticateUser } from "../middlewares/authMiddleware.js";

import {querySensorData} from "../services/influxService.js"

export const getPolyhouseData = async (req, res) => {
  try {
    const { polyhouseId } = req.params;

    // Validate polyhouseId
    if (!polyhouseId) {
      return res.status(400).json({ error: "Polyhouse ID is required" });
    }

    // Define the Flux query to fetch sensor data for the given polyhouseId
    const query = `
    from(bucket: "my-bucket")
      |> range(start: -1d) // Equivalent to last 1 day
      |> filter(fn: (r) => r["_measurement"] == "sensor_data") // Match measurement
      |> filter(fn: (r) => r["polyhouseId"] == "${polyhouseId}") // Match polyhouseId
      |> filter(fn: (r) => exists r["_value"] and r["_field"] == "distance") // Ensure "distance" field exists
      |> sort(columns: ["_time"], desc: true) // Sort by time, descending
      |> limit(n: 1) // Limit to 1 record
  `;
  


    // Fetch sensor data
    const sensorData = await querySensorData(query);

    if (!sensorData || sensorData.length === 0) {
      return res.status(404).json({ error: "No sensor data found for the specified polyhouse" });
    }

    // Get the latest distance (assuming distance is stored in _value field)
    const latestData = sensorData[0];
    const response = {
      polyhouseId,
      distance: latestData._value || "N/A", // You can modify this as needed
    };

    // Respond with the formatted data
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching polyhouse data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Add a new polyhouse
 */

const addPolyhouse = [
  authenticateUser,
  async (req, res) => {
    try {
      const { name, location } = req.body;

      // Validate input
      if (!name || !location || !location.address) {
        return res.status(400).json({ error: "Name and valid address are required." });
      }

      // Create a new Polyhouse
      const newPolyhouse = new Polyhouse({
        name,
        location: {
          address: location.address || "", // Optional address
        },
        user: req.user._id, // Link polyhouse to the authenticated user
      });

      // Save the polyhouse
      await newPolyhouse.save();

      res.status(201).json({ message: "Polyhouse created successfully", polyhouse: newPolyhouse });
    } catch (error) {
      console.error("Error creating polyhouse:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];

//Get Polyhouses

const getPolyhouses = [
  authenticateUser,
  async (req, res) => {
    try {
      const polyhouses = await Polyhouse.find({ user: req.user._id }).populate("user", "name email");
      res.status(200).json(polyhouses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch polyhouses", details: error.message });
    }
  },
];

/**
 * Update polyhouse details
 */
const updatePolyhouse = async (req, res) => {
  try {
    const { polyhouseId } = req.params;
    const updates = req.body;

    const polyhouse = await Polyhouse.findByIdAndUpdate(polyhouseId, updates, { new: true });
    if (!polyhouse) return res.status(404).json({ error: 'Polyhouse not found' });

    res.status(200).json({ message: 'Polyhouse updated successfully', polyhouse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update polyhouse', details: error.message });
  }
};

/**
 * Delete a polyhouse
 */
const deletePolyhouse = async (req, res) => {
  try {
    const { polyhouseId } = req.params;

    const deleted = await Polyhouse.findByIdAndDelete(polyhouseId);
    if (!deleted) return res.status(404).json({ error: 'Polyhouse not found' });

    res.status(200).json({ message: 'Polyhouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete polyhouse', details: error.message });
  }
};

export { addPolyhouse, getPolyhouses, updatePolyhouse, deletePolyhouse };
