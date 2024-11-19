import express from 'express';
import { addPolyhouse, getPolyhouses, updatePolyhouse, deletePolyhouse } from '../controllers/polyhouseController.js';

const router = express.Router();

// Add a new polyhouse
router.post('/', addPolyhouse);

// Get all polyhouses for a user
router.get('/:userId', getPolyhouses);

// Update a polyhouse
router.put('/:polyhouseId', updatePolyhouse);

// Delete a polyhouse
router.delete('/:polyhouseId', deletePolyhouse);

export default router;
