const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  resolved: {
    type: Boolean,
    required: true,
    default: false
  },
  resolvedAt: {
    type: Date,
    default: null
  },
}, {
  timestamps: true 
});


module.exports = mongoose.models.Incident || mongoose.model('Incident', incidentSchema);