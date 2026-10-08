import { create } from 'zustand';
import {
  getNotes as apiGetNotes,
  getNoteById as apiGetNoteById,
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
  archiveNote as apiArchiveNote,
} from '../services/api';

export const useNoteStore = create((set, get) => ({
  notes: [],
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
  currentNote: null,
  loading: false,
  error: null,

  // Active filters
  filters: {
    search: '',
    subject: '',
    topic: '',
    page: 1,
    limit: 9,
  },

  clearError: () => set({ error: null }),

  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        page: key === 'page' ? value : 1, // Reset to page 1 unless paging
      },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        subject: '',
        topic: '',
        page: 1,
        limit: 9,
      },
    });
  },

  fetchNotes: async (customParams = {}) => {
    set({ loading: true, error: null });
    const currentFilters = get().filters;
    const params = { ...currentFilters, ...customParams };

    try {
      const data = await apiGetNotes(params);
      set({
        notes: data.notes || [],
        pagination: data.pagination || { total: 0, page: 1, pages: 1 },
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to fetch notes',
      });
    }
  },

  fetchNoteById: async (id) => {
    set({ loading: true, error: null, currentNote: null });
    try {
      const note = await apiGetNoteById(id);
      set({ currentNote: note, loading: false });
      return { success: true, note };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch note';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  addNote: async (noteData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCreateNote(noteData);
      set((state) => ({
        notes: [res.note, ...state.notes],
        loading: false,
      }));
      return { success: true, note: res.note };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create note';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  editNote: async (id, noteData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiUpdateNote(id, noteData);
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? res.note : n)),
        currentNote: state.currentNote?._id === id ? res.note : state.currentNote,
        loading: false,
      }));
      return { success: true, note: res.note };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update note';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  removeNote: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== id),
        currentNote: state.currentNote?._id === id ? null : state.currentNote,
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete note';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  archiveNoteById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await apiArchiveNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== id),
        loading: false,
      }));
      return { success: true, note: res.note };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to archive note';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },
}));

export default useNoteStore;
