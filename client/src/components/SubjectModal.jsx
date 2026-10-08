import React, { useState, useEffect } from 'react';
import { X, BookPlus, AlertCircle } from 'lucide-react';
import useSubjectStore from '../store/subjectStore';

const SubjectModal = ({ isOpen, onClose, editingSubject = null, onSuccess }) => {
  const { addSubject, editSubject } = useSubjectStore();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: 1,
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingSubject) {
        setFormData({
          name: editingSubject.name || '',
          code: editingSubject.code || '',
          semester: editingSubject.semester || 1,
          description: editingSubject.description || '',
        });
      } else {
        setFormData({
          name: '',
          code: '',
          semester: 1,
          description: '',
        });
      }
      setErrorMessage('');
    }
  }, [isOpen, editingSubject]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.code.trim()) {
      setErrorMessage('Subject name and code are required');
      return;
    }

    if (formData.semester < 1 || formData.semester > 8) {
      setErrorMessage('Semester must be between 1 and 8');
      return;
    }

    setSubmitting(true);

    let res;
    if (editingSubject) {
      res = await editSubject(editingSubject._id, formData);
    } else {
      res = await addSubject(formData);
    }

    setSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess(res.subject);
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to save subject');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div 
        className="w-full max-w-lg bg-[#141414] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <BookPlus className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-lg font-bold text-white">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Subject Name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g., Data Structures & Algorithms"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Subject Code <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                required
                placeholder="e.g., CS201"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm uppercase focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Semester (1 - 8) <span className="text-amber-500">*</span>
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Brief summary of syllabus or topics covered..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
            />
          </div>

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
              {submitting ? 'Saving...' : editingSubject ? 'Update Subject' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;
