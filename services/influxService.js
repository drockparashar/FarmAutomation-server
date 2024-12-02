import { influxConnect } from "../config/db.js";
import { Point } from "@influxdata/influxdb-client";

const influxClient = influxConnect();
const writeApi = influxClient.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET, "ns"); // Nanosecond precision
const queryApi = influxClient.getQueryApi(process.env.INFLUX_ORG);

/**
 * Writes an array of data points to InfluxDB.
 * @param {Array} data - Array of data points to be written.
 * Each data point should have the format:
 * {
 *   measurement: "sensor_data",
 *   tags: { polyhouseId: "polyhouse_001" },
 *   fields: { distance: 15.2 },
 *   timestamp: "2023-11-17T10:00:00Z" (optional)
 * }
 * @returns {Object} - Success message or throws an error.
 */
export const writeSensorData = async (data) => {
  try {
    data.forEach((point) => {
      const influxPoint = new Point(point.measurement)
        .tag("polyhouseId", point.tags.polyhouseId)
        .floatField("distance", point.fields.distance);

      if (point.timestamp) {
        influxPoint.timestamp(new Date(point.timestamp).getTime() * 1e6); // Convert to nanoseconds
      }

      writeApi.writePoint(influxPoint);
    });

    await writeApi.flush();
    console.log("Sensor data written to InfluxDB successfully.");
    return { success: true, message: "Sensor data written successfully" };
  } catch (err) {
    console.error("Error writing sensor data to InfluxDB:", err.message);
    throw err;
  }
};

/**
 * Queries data from InfluxDB using a Flux query.
 * @param {string} query - Flux query string to execute.
 * @returns {Array} - Array of query results.
 */
export const querySensorData = async (query) => {
  try {
    const sensorData = [];

    await queryApi.queryRows(query, {
      next(row, tableMeta) {
        sensorData.push(tableMeta.toObject(row));
      },
      error(err) {
        console.error("Error querying InfluxDB:", err.message);
        throw err;
      },
      complete() {
        console.log("Query completed successfully.");
      },
    });

    return sensorData;
  } catch (err) {
    console.error("Query Error:", err.message);
    throw err;
  }
};
