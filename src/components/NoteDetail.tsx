import React from 'react'
import MarkdownRenderer from './MarkdownRenderer'

interface NoteDetailProps {
  note: any
  onClose: () => void
  isDarkMode?: boolean
}

export default function NoteDetail({ note, onClose, isDarkMode }: NoteDetailProps) {
  if (!note) return null

  const created = note.createdAt ? new Date(note.createdAt).toLocaleString() : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/40'}`} onClick={onClose} />

      <div className={`relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="flex items-center justify-between p-4 border-b" >
          <div>
            <h2 className="text-xl font-semibold">{note.title}</h2>
            {created && <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{created}</div>}
          </div>
          <button onClick={onClose} className="px-3 py-1 rounded-full border">
            Close
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-3 gap-6">
          {note.image ? (
            <div className="md:col-span-1 rounded-lg overflow-hidden">
              <img src={note.image} alt={note.title} className="w-full h-56 object-cover" />
            </div>
          ) : null}

          <div className="md:col-span-2">
            <div className="space-y-4 mb-4 max-h-[34rem] overflow-y-auto pr-2">
              {note.summary ? (
                <MarkdownRenderer
                  content={note.summary}
                  isDarkMode={isDarkMode}
                  wrapperClassName="space-y-4"
                  overrides={{
                    paragraph: `leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`,
                    heading: (level: number) => `font-semibold ${level === 1 ? 'text-2xl mb-4 mt-4' : 'text-xl mb-3 mt-3'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                  }}
                />
              ) : (
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No content available</p>
              )}
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This is a preview. Click "Open Source" or navigate to the full note for complete content.</p>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <a href={note.link || '#'} target="_blank" rel="noreferrer" className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
            Open Source
          </a>
          <button onClick={onClose} className="px-4 py-2 rounded-full border">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
