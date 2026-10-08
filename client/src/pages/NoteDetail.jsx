import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Calendar, 
  Tag, 
  User, 
  BookOpen, 
  GraduationCap, 
  Copy, 
  Check, 
  Printer, 
  Edit2, 
  Trash2, 
  Archive,
  Download
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CreateNoteModal from '../components/CreateNoteModal';
import FooterSection from '../components/FooterSection';
import useNoteStore from '../store/noteStore';
import useAuthStore from '../store/authStore';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, loading, error, fetchNoteById, removeNote, archiveNoteById } = useNoteStore();
  const { isAdmin } = useAuthStore();

  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchNoteById(id);
    }
  }, [id, fetchNoteById]);

  const handleCopy = () => {
    if (currentNote?.content) {
      navigator.clipboard.writeText(currentNote.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note permanently?')) {
      const res = await removeNote(id);
      if (res.success) {
        navigate('/notes');
      }
    }
  };

  const handleArchive = async () => {
    if (window.confirm('Archive this note? It will no longer be visible in the public notes list.')) {
      const res = await archiveNoteById(id);
      if (res.success) {
        navigate('/notes');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Opening note documentation...</p>
        </div>
        <FooterSection />
      </div>
    );
  }

  if (error || !currentNote) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Note Not Found</h2>
          <p className="text-gray-400 max-w-md mb-6">{error || 'The requested note could not be retrieved or has been archived.'}</p>
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Notes</span>
          </Link>
        </div>
        <FooterSection />
      </div>
    );
  }

  const formattedDate = currentNote.createdAt
    ? new Date(currentNote.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const subjectName = currentNote.subject?.name || 'General';
  const subjectCode = currentNote.subject?.code ? ` (${currentNote.subject.code})` : '';
  const semesterNum = currentNote.subject?.semester;

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-slate-900 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Back Navigation & Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>Back to All Notes</span>
          </Link>

          {/* Quick Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-[#e5e2d9] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="Copy Note Text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Content'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-[#e5e2d9] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="Print Note"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Admin Controls */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 border border-amber-500/30 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  title="Edit Note"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleArchive}
                  className="p-1.5 rounded-xl bg-white hover:bg-amber-500/10 text-slate-500 hover:text-amber-700 border border-[#e5e2d9] text-xs shadow-2xs transition-all cursor-pointer"
                  title="Archive Note"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-xl bg-white hover:bg-red-500/15 text-slate-500 hover:text-red-700 border border-[#e5e2d9] text-xs shadow-2xs transition-all cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Note Article Container (Section Layout Soft Off-White #FAF9F6) */}
        <article className="rounded-3xl bg-[#FAF9F6] border border-[#e5e2d9] p-6 sm:p-10 shadow-md relative overflow-hidden">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{subjectName}{subjectCode}</span>
            </span>

            {semesterNum && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-[#e5e2d9]">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                <span>Semester {semesterNum}</span>
              </span>
            )}

            {currentNote.topic && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                Topic: {currentNote.topic}
              </span>
            )}

            <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
              <Eye className="w-3.5 h-3.5" />
              <span>{currentNote.views || 0} views</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 relative z-10">
            {currentNote.title}
          </h1>

          {/* Subline: Author & Date */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-6 mb-8 border-b border-[#e5e2d9] relative z-10">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Published on {formattedDate}</span>
            </div>
            {currentNote.createdBy?.name && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Author: {currentNote.createdBy.name}</span>
              </div>
            )}
          </div>

          {/* Note Content Body */}
          <div className="relative z-10 text-slate-800 text-base leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
            {currentNote.content}
          </div>

          {/* Attachments Section if present */}
          {currentNote.attachments && currentNote.attachments.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#e5e2d9] relative z-10">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
                Attached Files & Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentNote.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-[#e5e2d9] transition-colors group cursor-pointer shadow-2xs"
                  >
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-amber-600 truncate">
                      {att.filename || `Attachment ${idx + 1}`}
                    </span>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags footer */}
          {currentNote.tags && currentNote.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#e5e2d9] relative z-10">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Tags & Classifications</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentNote.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:border-amber-500/40 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Edit Note Modal */}
      <CreateNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingNote={currentNote}
        onSuccess={() => {
          fetchNoteById(id);
        }}
      />

      <FooterSection />
    </div>
  );
};

export default NoteDetail;
