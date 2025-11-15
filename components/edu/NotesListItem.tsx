'use client'

import Link from 'next/link'

interface NotesListItemProps {
  note: {
    id: string
    content: string
    created_at: string
    lesson: {
      id: string
      title: string
      course: {
        title: string
        slug: string
      }
    }
  }
  onEdit?: (noteId: string, content: string) => void
  onDelete?: (noteId: string) => void
}

export default function NotesListItem({ note, onEdit, onDelete }: NotesListItemProps) {
  return (
    <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-5 hover:border-white/20 transition-all duration-300">
      {/* Course and Lesson Info */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <Link 
            href={`/user/edu/${note.lesson.course.slug}/${note.lesson.id}`}
            className="text-blue-400 hover:text-blue-300 font-telegraf text-sm transition-colors"
          >
            {note.lesson.course.title} → {note.lesson.title}
          </Link>
        </div>
        <span className="text-white/40 text-xs font-telegraf flex-shrink-0">
          {new Date(note.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Note Content */}
      <p className="text-white/80 font-telegraf text-sm whitespace-pre-wrap mb-3 line-clamp-4">
        {note.content}
      </p>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-white/5">
        <Link
          href={`/user/edu/${note.lesson.course.slug}/${note.lesson.id}`}
          className="text-blue-400 hover:text-blue-300 text-xs font-telegraf transition-colors"
        >
          View Lesson
        </Link>
        {onEdit && (
          <button
            onClick={() => onEdit(note.id, note.content)}
            className="text-white/60 hover:text-white text-xs font-telegraf transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="text-red-400 hover:text-red-300 text-xs font-telegraf transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

