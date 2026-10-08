import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Archive, 
  Eye, 
  Search, 
  Lock,
  ArrowUpRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import CreateNoteModal from '../components/CreateNoteModal';
import SubjectModal from '../components/SubjectModal';
import useAuthStore from '../store/authStore';
import useSubjectStore from '../store/subjectStore';
import useNoteStore from '../store/noteStore';

const AdminPanel = () => {
  const { user, isAdmin, isAuthenticated } = useAuthStore();
  const { subjects, fetchSubjects, removeSubject } = useSubjectStore();
  const { notes, fetchNotes, removeNote, archiveNoteById } = useNoteStore();

  const [activeTab, setActiveTab] = useState('notes'); // 'overview' | 'notes' | 'subjects'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchNotes({ limit: 50 });
  }, [fetchSubjects, fetchNotes]);

  // Non-admin guard
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col selection:bg-amber-500 selection:text-black">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Authorization Required</h2>
          <p className="text-gray-400 max-w-md mb-6 text-sm">
            You must be logged in as an administrator to access the course notes management portal and subject configuration.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-black font-bold text-sm transition-all"
            >
              Sign In as Admin
            </Link>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl border border-white/20 hover:bg-white/5 text-gray-300 text-sm font-semibold transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  // Filter notes for table
  const filteredNotes = notes.filter((n) => {
    const q = searchTerm.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.topic?.toLowerCase().includes(q) ||
      n.subject?.name?.toLowerCase().includes(q)
    );
  });

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject? Notes associated with it may be affected.')) {
      await removeSubject(id);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Permanently delete this note?')) {
      await removeNote(id);
    }
  };

  const handleArchiveNote = async (id) => {
    if (window.confirm('Archive this note? It will become inaccessible to students.')) {
      await archiveNoteById(id);
    }
  };

  // Metrics
  const totalNotes = notes.length;
  const totalSubjects = subjects.length;
  const totalViews = notes.reduce((sum, n) => sum + (n.views || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar onOpenCreateModal={() => { setEditingNote(null); setNoteModalOpen(true); }} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrative Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Curriculum & Content Management
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Logged in as <span className="text-white font-medium">{user?.name}</span> ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingSubject(null);
                setSubjectModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-teal-400" />
              <span>New Subject</span>
            </button>
            <button
              onClick={() => {
                setEditingNote(null);
                setNoteModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-black text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-[#141414] border border-white/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Total Notes</p>
              <p className="text-2xl font-black text-white">{totalNotes}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#141414] border border-white/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Subjects Registered</p>
              <p className="text-2xl font-black text-white">{totalSubjects}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#141414] border border-white/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Total Note Reads</p>
              <p className="text-2xl font-black text-white">{totalViews}</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 mb-6 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'border-[#F59E0B] text-[#F59E0B]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Manage Notes ({totalNotes})</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'subjects'
                ? 'border-[#F59E0B] text-[#F59E0B]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Subjects ({totalSubjects})</span>
          </button>
        </div>

        {/* TAB 1: NOTES MANAGEMENT */}
        {activeTab === 'notes' && (
          <div>
            {/* Search Filter */}
            <div className="mb-4 max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes in admin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Notes Table */}
            <div className="rounded-2xl bg-[#141414] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-black/50 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Title</th>
                      <th className="py-3.5 px-4 font-semibold">Subject</th>
                      <th className="py-3.5 px-4 font-semibold">Topic</th>
                      <th className="py-3.5 px-4 font-semibold">Views</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredNotes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No notes found.
                        </td>
                      </tr>
                    ) : (
                      filteredNotes.map((note) => (
                        <tr key={note._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                            <Link to={`/notes/${note._id}`} className="hover:text-amber-400">
                              {note.title}
                            </Link>
                          </td>
                          <td className="py-3.5 px-4 text-gray-300 text-xs">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              {note.subject?.name || 'Unknown'} {note.subject?.code ? `(${note.subject.code})` : ''}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-teal-400 text-xs">
                            {note.topic}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 text-xs">
                            {note.views || 0}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/notes/${note._id}`}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                title="View Note"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => {
                                  setEditingNote(note);
                                  setNoteModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                                title="Edit Note"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleArchiveNote(note._id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors cursor-pointer"
                                title="Archive Note"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note._id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Delete Note"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBJECTS MANAGEMENT */}
        {activeTab === 'subjects' && (
          <div>
            <div className="rounded-2xl bg-[#141414] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-black/50 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Subject Name</th>
                      <th className="py-3.5 px-4 font-semibold">Code</th>
                      <th className="py-3.5 px-4 font-semibold">Semester</th>
                      <th className="py-3.5 px-4 font-semibold">Description</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {subjects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No subjects configured yet. Click "New Subject" to create one.
                        </td>
                      </tr>
                    ) : (
                      subjects.map((sub) => (
                        <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-medium text-white">
                            {sub.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-amber-400 text-xs">
                            {sub.code}
                          </td>
                          <td className="py-3.5 px-4 text-xs">
                            <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/20 font-semibold">
                              Semester {sub.semester}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 text-xs max-w-sm truncate">
                            {sub.description || '-'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingSubject(sub);
                                  setSubjectModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                                title="Edit Subject"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubject(sub._id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Delete Subject"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateNoteModal
        isOpen={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false);
          setEditingNote(null);
        }}
        editingNote={editingNote}
        onSuccess={() => {
          fetchNotes({ limit: 50 });
        }}
      />

      <SubjectModal
        isOpen={subjectModalOpen}
        onClose={() => {
          setSubjectModalOpen(false);
          setEditingSubject(null);
        }}
        editingSubject={editingSubject}
        onSuccess={() => {
          fetchSubjects();
        }}
      />

      <FooterSection />
    </div>
  );
};

export default AdminPanel;
