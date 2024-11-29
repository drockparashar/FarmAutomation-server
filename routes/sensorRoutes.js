import express from "express";
import { handleSensorData } from "../controllers/sensorController.js";

const router = express.Router();

// POST /api/sensor-data
router.post("/sensor-data", handleSensorData);

export default router;
