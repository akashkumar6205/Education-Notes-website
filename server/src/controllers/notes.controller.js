import Note from '../models/Note.js';
import Subject from '../models/Subject.js';
import { isValidObjectId, validatePagination } from '../middleware/validation.js';

// Get all notes (with filters)
export const getAllNotes = async (req, res) => {
  try {
    const { subject, topic, search, category, type, page = 1, limit = 10 } = req.query;

    // Validate pagination
    const paginationValidation = validatePagination(page, limit);
    if (!paginationValidation.valid) {
      return res.status(400).json({ message: paginationValidation.error });
    }

    let filter = { isArchived: false };

    const resourceType = category || type;
    if (resourceType && resourceType !== 'all') {
      filter.category = resourceType;
    }

    if (subject) {
      if (!isValidObjectId(subject)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      filter.subject = subject;
    }
    if (topic) filter.topic = new RegExp(topic, 'i');

    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const notes = await Note.find(filter)
      .populate('subject', 'name code')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Note.countDocuments(filter);

    res.json({
      notes,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotes = getAllNotes;

// Get single note
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('subject', 'name code semester')
      .populate('createdBy', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNoteById = getNote;

// Create note (Admin only)
export const createNote = async (req, res) => {
  try {
    const { title, content, subject, topic, tags, category } = req.body;

    // Validate ObjectId format
    if (!isValidObjectId(subject)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Validate string length
    if (title && (title.length < 1 || title.length > 200)) {
      return res.status(400).json({ message: 'Title must be 1-200 characters' });
    }

    // Verify subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const note = new Note({
      title,
      content,
      subject,
      topic,
      category: ['notes', 'syllabus', 'pyq'].includes(category) ? category : 'notes',
      tags: tags || [],
      createdBy: req.user?.id || req.body.createdBy,
    });

    await note.save();
    await note.populate('subject', 'name code');
    if (note.createdBy) {
      await note.populate('createdBy', 'name email');
    }

    res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update note (Admin only)
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { title, content, topic, tags, category } = req.body;

    // Validate string length
    if (title && (title.length < 1 || title.length > 200)) {
      return res.status(400).json({ message: 'Title must be 1-200 characters' });
    }

    const updateFields = { title, content, topic, tags, updatedAt: Date.now() };
    if (category && ['notes', 'syllabus', 'pyq'].includes(category)) {
      updateFields.category = category;
    }

    const note = await Note.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('subject', 'name code')
      .populate('createdBy', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      message: 'Note updated',
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete note (Admin only)
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archive note
export const archiveNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note archived', note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


