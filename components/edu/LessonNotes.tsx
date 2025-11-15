'use client'

import { useState } from 'react'

interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
}

interface LessonNotesProps {
  lessonId: string
  initialNotes: Note[]
  onNotesChange?: () => void
}

export default function LessonNotes({ lessonId, initialNotes, onNotesChange }: LessonNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateNote = async () => {
    if (!newNote.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/edu/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          content: newNote
        })
      })

      if (response.ok) {
        const { note } = await response.json()
        setNotes([note, ...notes])
        setNewNote('')
        onNotesChange?.()
      }
    } catch (error) {
      console.error('Error creating note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/edu/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })

      if (response.ok) {
        const { note } = await response.json()
        setNotes(notes.map(n => n.id === noteId ? note : n))
        setEditingNoteId(null)
        setEditContent('')
        onNotesChange?.()
      }
    } catch (error) {
      console.error('Error updating note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`/api/edu/notes/${noteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId))
        onNotesChange?.()
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setEditingNoteId(null)
    setEditContent('')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-telegraf font-bold text-white">Notes</h3>

      {/* Create New Note */}
      <div className="space-y-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Take notes on this lesson..."
          className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white placeholder-white/40 font-telegraf focus:outline-none focus:border-white/40 transition-colors resize-none"
          rows={4}
        />
        <button
          onClick={handleCreateNote}
          disabled={!newNote.trim() || isSubmitting}
          className="px-6 py-2 bg-white text-black hover:bg-white/90 disabled:bg-white/30 disabled:cursor-not-allowed rounded-[3px] font-telegraf font-semibold transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Add Note'}
        </button>
      </div>

      {/* Existing Notes */}
      <div className="space-y-3">
        {notes.map(note => (
          <div 
            key={note.id}
            className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-4"
          >
            {editingNoteId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40 transition-colors resize-none"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateNote(note.id)}
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-white text-black hover:bg-white/90 disabled:bg-white/30 rounded-[3px] font-telegraf text-sm font-semibold transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-1.5 bg-white/10 text-white hover:bg-white/20 rounded-[3px] font-telegraf text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-white/80 font-telegraf text-sm whitespace-pre-wrap mb-3">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-xs font-telegraf">
                    {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(note)}
                      className="text-blue-400 hover:text-blue-300 text-xs font-telegraf transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-telegraf transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <p className="text-white/40 font-telegraf text-sm text-center py-8">
          No notes yet. Start taking notes above!
        </p>
      )}
    </div>
  )
}

