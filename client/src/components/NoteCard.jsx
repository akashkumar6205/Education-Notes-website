import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, BookOpen, Clock, Tag, ArrowUpRight, Edit2, Trash2, Archive } from 'lucide-react';
import useAuthStore from '../store/authStore';

const NoteCard = ({ note, onEdit, onDelete, onArchive }) => {
  const { isAdmin } = useAuthStore();

  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Get subject label
  const subjectName = note.subject?.name || 'General';
  const subjectCode = note.subject?.code ? ` (${note.subject.code})` : '';

  return (
    <div className="group relative rounded-2xl bg-[#FAF9F6] hover:bg-white border border-[#e5e2d9] hover:border-amber-500/70 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-lg">
      {/* Top Header: Category & Subject Pill & Views Counter */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {note.category && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                note.category === 'syllabus' 
                  ? 'bg-sky-500/15 text-sky-800 border border-sky-500/30'
                  : note.category === 'pyq'
                  ? 'bg-purple-500/15 text-purple-800 border border-purple-500/30'
                  : 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
              }`}>
                {note.category === 'syllabus' ? 'Syllabus' : note.category === 'pyq' ? 'PYQ' : 'Note'}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 border border-amber-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="truncate max-w-[170px]">{subjectName}{subjectCode}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Eye className="w-3.5 h-3.5" />
            <span>{note.views || 0}</span>
          </div>
        </div>

        {/* Note Title */}
        <Link to={`/notes/${note._id}`} className="block group/title">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover/title:text-amber-600 transition-colors line-clamp-2 leading-snug">
            {note.title}
          </h3>
        </Link>

        {/* Topic Badge */}
        {note.topic && (
          <div className="mt-2 text-xs font-semibold text-teal-800 flex items-center gap-1">
            <span className="text-slate-500 font-medium">Topic:</span>
            <span className="bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{note.topic}</span>
          </div>
        )}

        {/* Snippet / Excerpt */}
        <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                <Tag className="w-2.5 h-2.5 text-amber-600" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Area: Author / Date & Actions */}
      <div className="mt-6 pt-4 border-t border-[#e5e2d9] flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formattedDate}</span>
          {note.createdBy?.name && (
            <span className="text-slate-500 hidden sm:inline">&bull; by {note.createdBy.name}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex items-center gap-1 mr-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(note);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                  title="Edit Note"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onArchive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onArchive(note._id);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                  title="Archive Note"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(note._id);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <Link
            to={`/notes/${note._id}`}
            className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
