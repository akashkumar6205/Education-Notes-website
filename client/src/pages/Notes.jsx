import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import CreateNoteModal from '../components/CreateNoteModal';
import FooterSection from '../components/FooterSection';
import useNoteStore from '../store/noteStore';
import useSubjectStore from '../store/subjectStore';
import useAuthStore from '../store/authStore';

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { notes, pagination, loading, filters, setFilter, resetFilters, fetchNotes, removeNote, archiveNoteById } = useNoteStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const { isAdmin } = useAuthStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(
    searchParams.get('semester') ? Number(searchParams.get('semester')) : 'all'
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get('type') || 'all'
  );

  // Initialize subjects and initial notes
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Sync query params from URL (e.g., if user came from Home page clicking a semester or resource type)
  useEffect(() => {
    const semParam = searchParams.get('semester');
    if (semParam) {
      setSelectedSemester(Number(semParam));
    } else {
      setSelectedSemester('all');
    }

    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedType(typeParam);
    } else {
      setSelectedType('all');
    }
  }, [searchParams]);

  // Trigger fetchNotes when filters or selectedSemester changes
  useEffect(() => {
    let subjectParam = filters.subject;

    fetchNotes({
      search: filters.search,
      subject: subjectParam,
      topic: filters.topic,
      page: filters.page,
      limit: 9,
    });
  }, [filters.search, filters.subject, filters.topic, filters.page, fetchNotes]);

  // Filter available subjects based on selectedSemester
  const availableSubjects = selectedSemester === 'all'
    ? subjects
    : subjects.filter((s) => s.semester === Number(selectedSemester));

  const handleSemesterChange = (sem) => {
    setSelectedSemester(sem);
    if (sem !== 'all') {
      const subjectBelongs = subjects.some(
        (s) => s._id === filters.subject && s.semester === Number(sem)
      );
      if (!subjectBelongs) {
        setFilter('subject', '');
      }
    }
    
    // Update URL query params
    const nextParams = new URLSearchParams(searchParams);
    if (sem === 'all') {
      nextParams.delete('semester');
    } else {
      nextParams.set('semester', sem.toString());
    }
    setSearchParams(nextParams);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const nextParams = new URLSearchParams(searchParams);
    if (type === 'all') {
      nextParams.delete('type');
    } else {
      nextParams.set('type', type);
    }
    setSearchParams(nextParams);
  };

  const handleSearchChange = (e) => {
    setFilter('search', e.target.value);
  };

  const handleSubjectChange = (e) => {
    setFilter('subject', e.target.value);
  };

  const handleTopicChange = (e) => {
    setFilter('topic', e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilter('page', newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await removeNote(id);
    }
  };

  const handleArchiveNote = async (id) => {
    if (window.confirm('Archive this note? It will be hidden from public view.')) {
      await archiveNoteById(id);
    }
  };

  // Filter notes in client if semester filter is active and subject was not explicitly chosen
  const displayedNotes = notes.filter((note) => {
    // Semester filtering
    if (selectedSemester !== 'all' && !filters.subject) {
      const sub = subjects.find((s) => s._id === (note.subject?._id || note.subject));
      if (sub && sub.semester !== Number(selectedSemester)) {
        return false;
      }
    }

    // Resource Type filtering (notes, syllabus, pyq)
    if (selectedType !== 'all') {
      if (note.category) {
        if (note.category !== selectedType) return false;
      } else {
        // Fallback matching
        const noteTagStr = (note.tags || []).join(' ').toLowerCase();
        const noteText = `${note.title || ''} ${note.topic || ''} ${noteTagStr}`.toLowerCase();
        if (selectedType === 'syllabus' && !noteText.includes('syllabus')) return false;
        if (selectedType === 'pyq' && !noteText.includes('pyq') && !noteText.includes('paper') && !noteText.includes('exam')) return false;
        if (selectedType === 'notes' && (noteText.includes('syllabus') || noteText.includes('pyq') || noteText.includes('previous year'))) return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-slate-900 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Global Navbar */}
      <Navbar onOpenCreateModal={() => { setEditingNote(null); setModalOpen(true); }} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Title & Tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#e5e2d9]">
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs sm:text-sm font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Curated Computer Science Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {selectedType === 'syllabus' 
                ? 'Syllabus & Schemes' 
                : selectedType === 'pyq' 
                ? 'Previous Year Papers (PYQs)' 
                : selectedType === 'notes' 
                ? 'Study Notes & Guides' 
                : 'Study Notes & Resources'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {selectedType === 'syllabus'
                ? 'Access official RGPV syllabus, subject outlines, and credit marking schemes.'
                : selectedType === 'pyq'
                ? 'Prepare effectively with previous university examination papers and model answers.'
                : 'Access well-structured lecture summaries, algorithms, exam tips, and subject resources.'}
            </p>
          </div>

          {/* Admin "Add Note" Button */}
          {isAdmin && (
            <button
              onClick={() => {
                setEditingNote(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-[0_2px_15px_rgba(245,158,11,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Resource</span>
            </button>
          )}
        </div>

        {/* Resource Type & Semester Switchers Container */}
        <div className="space-y-3 mb-6">
          {/* Resource Type (Notes / Syllabus / PYQ) Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline uppercase tracking-wider">Type:</span>
            <button
              onClick={() => handleTypeChange('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-[#FAF9F6] text-slate-700 hover:bg-white hover:text-black border border-[#e5e2d9]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => handleTypeChange('notes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedType === 'notes'
                  ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-[0_2px_12px_rgba(245,158,11,0.35)]'
                  : 'bg-[#FAF9F6] text-slate-700 hover:bg-white hover:text-black border border-[#e5e2d9]'
              }`}
            >
              <span>📚 Notes</span>
            </button>
            <button
              onClick={() => handleTypeChange('syllabus')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedType === 'syllabus'
                  ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-[0_2px_12px_rgba(245,158,11,0.35)]'
                  : 'bg-[#FAF9F6] text-slate-700 hover:bg-white hover:text-black border border-[#e5e2d9]'
              }`}
            >
              <span>📋 Syllabus</span>
            </button>
            <button
              onClick={() => handleTypeChange('pyq')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedType === 'pyq'
                  ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-[0_2px_12px_rgba(245,158,11,0.35)]'
                  : 'bg-[#FAF9F6] text-slate-700 hover:bg-white hover:text-black border border-[#e5e2d9]'
              }`}
            >
              <span>📑 Previous Year Papers</span>
            </button>
          </div>

          {/* Semester Tab Switcher */}
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={() => handleSemesterChange('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedSemester === 'all'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-[0_2px_12px_rgba(245,158,11,0.35)]'
                    : 'bg-[#FAF9F6] text-slate-700 hover:bg-white hover:text-black border border-[#e5e2d9]'
                }`}
              >
                All Semesters
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  onClick={() => handleSemesterChange(sem)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedSemester === sem
                      ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-[0_2px_12px_rgba(245,158,11,0.35)]'
                      : 'bg-[#FAF9F6] text-slate-700 hover:bg-white hover:text-black border border-[#e5e2d9]'
                  }`}
                >
                  Semester {sem}
                </button>
              ))} 
            </div>
          </div>
        </div>

        {/* Search & Filter Controls Bar (Section Layout Soft Off-White #FAF9F6) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 p-4 rounded-2xl bg-[#FAF9F6] border border-[#e5e2d9] shadow-sm">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, topic, or keyword..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#e5e2d9] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="md:col-span-4">
            <select
              value={filters.subject}
              onChange={handleSubjectChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e2d9] text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs cursor-pointer"
            >
              <option value="">All Subjects</option>
              {availableSubjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          {/* Topic Input */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Topic filter..."
              value={filters.topic}
              onChange={handleTopicChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e2d9] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* Reset Filters button */}
          <div className="md:col-span-1 flex items-center justify-center">
            <button
              onClick={() => {
                resetFilters();
                setSelectedSemester('all');
                setSelectedType('all');
                setSearchParams({});
              }}
              title="Reset all filters"
              className="w-full h-full min-h-[40px] flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-[#e5e2d9] transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-[#F59E0B] rounded-full animate-spin" />
            <p className="text-slate-600 text-sm font-medium">Fetching study materials...</p>
          </div>
        ) : displayedNotes.length === 0 ? (
          /* Empty State (Section Layout Soft Off-White #FAF9F6) */
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl bg-[#FAF9F6] border border-[#e5e2d9] shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Resources Found</h3>
            <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
              We couldn't find any resources matching your current criteria. Try adjusting your search query or selecting a different semester.
            </p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingNote(null);
                  setModalOpen(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Create the First Note
              </button>
            )}
          </div>
        ) : (
          /* Notes Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onArchive={handleArchiveNote}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#FAF9F6] hover:bg-white disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-sm font-medium border border-[#e5e2d9] shadow-2xs transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => handlePageChange(pg)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        pagination.page === pg
                          ? 'bg-[#F59E0B] text-slate-950 shadow-[0_2px_10px_rgba(245,158,11,0.35)]'
                          : 'bg-[#FAF9F6] hover:bg-white text-slate-700 border border-[#e5e2d9] shadow-2xs'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#FAF9F6] hover:bg-white disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-sm font-medium border border-[#e5e2d9] shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Note Creation / Editing Modal */}
      <CreateNoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNote(null);
        }}
        editingNote={editingNote}
        onSuccess={() => {
          fetchNotes();
        }}
      />

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Notes;
