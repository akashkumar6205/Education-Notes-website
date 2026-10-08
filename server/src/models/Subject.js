import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name required'],
    unique: true,
  },
  code: {
    type: String,
    required: true, // e.g., CS201, CS301
    unique: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;