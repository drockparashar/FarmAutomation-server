import express from 'express';
import { addPolyhouse, getPolyhouses, updatePolyhouse, deletePolyhouse, getPolyhouseData } from '../controllers/polyhouseController.js';

const router = express.Router();

// Add a new polyhouse
router.post('/', addPolyhouse);

// Get all polyhouses for a user
router.get('/', getPolyhouses);

router.get('/:polyhouseId', getPolyhouseData);

// Update a polyhouse
router.put('/:polyhouseId', updatePolyhouse);

// Delete a polyhouse
router.delete('/:polyhouseId', deletePolyhouse);

export default router;
