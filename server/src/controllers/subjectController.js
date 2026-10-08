import Subject from '../models/Subject.js';
import { isValidObjectId } from '../middleware/validation.js';

// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('createdBy', 'name email')
      .sort({ semester: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subjects by semester
export const getSubjectsBySemester = async (req, res) => {
  try {
    const { semester } = req.params;
    const semNum = Number(semester);

    // Validate semester (1-8)
    if (!Number.isInteger(semNum) || semNum < 1 || semNum > 8) {
      return res.status(400).json({ message: 'Semester must be between 1 and 8' });
    }

    const subjects = await Subject.find({ semester: semNum })
      .populate('createdBy', 'name email');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create subject (Admin only)
export const createSubject = async (req, res) => {
  try {
    const { name, code, semester, description } = req.body;

    // Validate semester (1-8)
    if (semester < 1 || semester > 8) {
      return res.status(400).json({ message: 'Semester must be between 1 and 8' });
    }

    const subject = new Subject({
      name,
      code,
      semester,
      description,
      createdBy: req.user?.id || req.body.createdBy,
    });

    await subject.save();
    res.status(201).json({
      message: 'Subject created',
      subject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subject (Admin only)
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { semester } = req.body;
    if (semester !== undefined && (semester < 1 || semester > 8)) {
      return res.status(400).json({ message: 'Semester must be between 1 and 8' });
    }

    const subject = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject updated', subject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete subject (Admin only)
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export default {
  getAllSubjects,
  getSubjectsBySemester,
  createSubject,
  updateSubject,
  deleteSubject,
};