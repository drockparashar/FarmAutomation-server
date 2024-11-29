import { writeSensorData } from "../services/influxService.js";

export const handleSensorData = async (req, res) => {
  try {
    const { polyhouseId, distances } = req.body;

    // Validate input
    if (!polyhouseId || !Array.isArray(distances) || distances.some((d) => typeof d !== "number" || d < 0)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Prepare data points for InfluxDB
    const dataPoints = distances.map((distance) => ({
      measurement: "sensor_data",
      tags: {
        polyhouseId,
      },
      fields: {
        distance,
      },
      timestamp: new Date().toISOString(), // Ensure proper timestamp
    }));

    // Write to InfluxDB
    await writeSensorData(dataPoints);

    res.status(201).json({ message: "Sensor data processed successfully" });
  } catch (error) {
    console.error("Error handling sensor data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
