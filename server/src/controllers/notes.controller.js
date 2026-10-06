import { Note } from '../models/Note.js';

// Get all notes
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find().sort({ isPinned: -1, updatedAt: -1 });
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
};

// Get single note by id
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// Create a new note
export const createNote = async (req, res, next) => {
  try {
    const { title, content, category, isPinned } = req.body;
    const note = await Note.create({ title, content, category, isPinned });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// Update note
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// Delete note
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
