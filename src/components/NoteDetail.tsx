import React from 'react'

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
            <div className="space-y-4 mb-4">
              {note.summary ? (
                note.summary.slice(0, 800).split('\n').map((paragraph: string, index: number) => {
                  if (!paragraph.trim()) return null;
                  
                  // Handle headers
                  if (paragraph.startsWith('#')) {
                    const level = paragraph.match(/^#+/)?.[0].length || 1;
                    const text = paragraph.replace(/^#+\s*/, '');
                    return (
                      <h4
                        key={index}
                        className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      >
                        {text}
                      </h4>
                    );
                  }
                  
                  // Handle code blocks
                  if (paragraph.match(/^\s{4,}/) || paragraph.startsWith('\t')) {
                    return (
                      <pre
                        key={index}
                        className={`p-3 rounded text-sm font-mono overflow-x-auto ${
                          isDarkMode 
                            ? 'bg-gray-800 text-green-400' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <code>{paragraph.trim()}</code>
                      </pre>
                    );
                  }
                  
                  // Handle numbered lists
                  if (paragraph.match(/^\d+\.\s/)) {
                    return (
                      <div key={index} className="flex gap-2">
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {paragraph.match(/^\d+/)?.[0]}.
                        </span>
                        <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                          {paragraph.replace(/^\d+\.\s*/, '')}
                        </span>
                      </div>
                    );
                  }
                  
                  // Regular paragraphs
                  return (
                    <p
                      key={index}
                      className={`leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                      {paragraph}
                    </p>
                  );
                }).filter(Boolean)
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
