import { create } from 'zustand';
import {
  getAllSubjects,
  getSubjectsBySemester,
  createSubject as apiCreateSubject,
  updateSubject as apiUpdateSubject,
  deleteSubject as apiDeleteSubject,
} from '../services/api';

export const useSubjectStore = create((set, get) => ({
  subjects: [],
  loading: false,
  error: null,
  selectedSemester: null,

  setSelectedSemester: (sem) => set({ selectedSemester: sem }),
  clearError: () => set({ error: null }),

  fetchSubjects: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllSubjects();
      set({ subjects: data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to load subjects',
      });
    }
  },

  fetchSubjectsBySemester: async (semester) => {
    set({ loading: true, error: null, selectedSemester: semester });
    try {
      const data = await getSubjectsBySemester(semester);
      set({ subjects: data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to load semester subjects',
      });
    }
  },

  addSubject: async (subjectData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCreateSubject(subjectData);
      set((state) => ({
        subjects: [...state.subjects, res.subject],
        loading: false,
      }));
      return { success: true, subject: res.subject };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create subject';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  editSubject: async (id, subjectData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiUpdateSubject(id, subjectData);
      set((state) => ({
        subjects: state.subjects.map((s) => (s._id === id ? res.subject : s)),
        loading: false,
      }));
      return { success: true, subject: res.subject };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update subject';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  removeSubject: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteSubject(id);
      set((state) => ({
        subjects: state.subjects.filter((s) => s._id !== id),
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete subject';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },
}));

export default useSubjectStore;
