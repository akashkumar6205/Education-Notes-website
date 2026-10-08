import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import useSubjectStore from '../store/subjectStore';
import useNoteStore from '../store/noteStore';

const CreateNoteModal = ({ isOpen, onClose, editingNote = null, onSuccess }) => {
  const { subjects, fetchSubjects } = useSubjectStore();
  const { addNote, editNote } = useNoteStore();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    topic: '',
    category: 'notes',
    tagInput: '',
    tags: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (!subjects || subjects.length === 0) {
        fetchSubjects();
      }
      if (editingNote) {
        setFormData({
          title: editingNote.title || '',
          content: editingNote.content || '',
          subject: editingNote.subject?._id || editingNote.subject || '',
          topic: editingNote.topic || '',
          category: editingNote.category || 'notes',
          tagInput: '',
          tags: Array.isArray(editingNote.tags) ? [...editingNote.tags] : [],
        });
      } else {
        setFormData({
          title: '',
          content: '',
          subject: subjects[0]?._id || '',
          topic: '',
          category: 'notes',
          tagInput: '',
          tags: [],
        });
      }
      setErrorMessage('');
    }
  }, [isOpen, editingNote, subjects.length]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const trimmed = formData.tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
        tagInput: '',
      }));
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Note title is required');
      return;
    }
    if (!formData.subject) {
      setErrorMessage('Please select a subject');
      return;
    }
    if (!formData.topic.trim()) {
      setErrorMessage('Topic is required');
      return;
    }
    if (!formData.content.trim()) {
      setErrorMessage('Content is required');
      return;
    }

    setSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      subject: formData.subject,
      topic: formData.topic.trim(),
      category: formData.category || 'notes',
      tags: formData.tags,
    };

    let res;
    if (editingNote) {
      res = await editNote(editingNote._id, payload);
    } else {
      res = await addNote(payload);
    }

    setSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess(res.note);
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to save note');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div 
        className="w-full max-w-2xl bg-[#141414] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-lg font-bold text-white">
              {editingNote ? 'Edit Resource / Note' : 'Create New Resource / Note'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Resource Category & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Resource Type <span className="text-amber-500">*</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="notes">📚 Notes (Lecture / Chapter)</option>
                <option value="syllabus">📋 Syllabus (RGPV Scheme)</option>
                <option value="pyq">📑 Previous Year Paper (PYQ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Subject <span className="text-amber-500">*</span>
              </label>
              <select
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="">Select a Subject</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.code}) - Sem {sub.semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Title <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={200}
              placeholder="e.g., Introduction to Binary Search Trees"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Topic / Unit <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="topic"
              required
              placeholder="e.g., Unit 1 - Trees, RGPV Exam 2023, Syllabus Outline"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Tags (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tag (e.g., Important, RGPV 2024, Exam)"
                value={formData.tagInput}
                onChange={(e) => setFormData((prev) => ({ ...prev, tagInput: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="text-amber-400/70 hover:text-white cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Content / Notes Body <span className="text-amber-500">*</span>
            </label>
            <textarea
              name="content"
              required
              rows={8}
              placeholder="Write or paste your educational notes, explanations, code samples, or key formulas here..."
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-mono transition-all resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 disabled:opacity-50 text-black text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
            >
              {submitting ? 'Saving...' : editingNote ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;
