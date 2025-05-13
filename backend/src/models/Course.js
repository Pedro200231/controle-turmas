import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default model('Course', courseSchema);
