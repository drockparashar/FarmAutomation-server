import Polyhouse from '../models/Polyhouse.js';

/**
 * Add a new polyhouse
 */
const addPolyhouse = async (req, res) => {
    try {
      const { userId, name, location, crops, configuration } = req.body;
  
      const polyhouse = new Polyhouse({
        user: userId,
        name,
        location,
        crops,
        configuration,
      });
  
      await polyhouse.save();
      res.status(201).json({ message: 'Polyhouse added successfully', polyhouse });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add polyhouse', details: error.message });
    }
  };
  

/**
 * Get all polyhouses for a user
 */
const getPolyhouses = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const polyhouses = await Polyhouse.find({ user: userId }).populate('user', 'name email');
      res.status(200).json(polyhouses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch polyhouses', details: error.message });
    }
  };
  

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
