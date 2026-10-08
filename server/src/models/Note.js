import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Note content required'],
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  topic: {
    type: String,
    required: true, // e.g., "Arrays", "Linked Lists"
  },
  category: {
    type: String,
    enum: ['notes', 'syllabus', 'pyq'],
    default: 'notes',
  },
  tags: [String], // ["Important", "Exam", "Revision"]
  attachments: [
    {
      filename: String,
      url: String,
      type: String, // pdf, image, etc
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search
noteSchema.index({ title: 'text', content: 'text', topic: 'text' });

export const Note = mongoose.model('Note', noteSchema);
export default Note;