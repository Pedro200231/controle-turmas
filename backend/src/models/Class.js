import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const classSchema = new Schema({
  course: {
    type: Types.ObjectId,
    ref: 'Course',
    required: true
  },
  professor: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export default model('Class', classSchema);
