import mongoose from 'mongoose';

const polyhouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  configuration: {
    temperatureRange: { min: Number, max: Number },
    humidityRange: { min: Number, max: Number },
  }
});

const Polyhouse = mongoose.model('Polyhouse', polyhouseSchema);
export default Polyhouse;
