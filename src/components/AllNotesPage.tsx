import React, { useMemo, useState, useEffect } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react'

export default function AllNotesPage() {
  const notes = useAppSelector((state) => state.portfolio.notes)
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  
  const navigate = useNavigate()

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Sort notes by latest first and filter by search query
  const filteredAndSortedNotes = useMemo(() => {
    if (!notes || notes.length === 0) return []
    
    // Sort by createdAt (latest first)
    const sorted = [...notes].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    // Filter by search query (title + summary)
    if (!searchQuery.trim()) return sorted
    
    const query = searchQuery.toLowerCase()
    return sorted.filter(note => 
      note.title.toLowerCase().includes(query) || 
      (note.summary && note.summary.toLowerCase().includes(query))
    )
  }, [notes, searchQuery])

  // Get the currently selected note for details view
  const currentNote = selectedNote ? filteredAndSortedNotes.find(note => note.id === selectedNote) : null

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      {/* Header with Search */}
      <div className={`border-b sticky top-0 z-50 ${isDarkMode ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-6 mb-6">
            <button
              onClick={() => navigate('/#field-notes')}
              className={`flex items-center gap-2 font-medium transition ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
            >
              <ArrowLeft size={20} />
              Back to Field Notes
            </button>
            <h1 className="text-3xl font-bold">All Field Notes</h1>
            <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
              {filteredAndSortedNotes.length} notes
            </span>
          </div>

          {/* Search Bar */}
          <div className={`relative max-w-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden shadow-sm`}>
            <Search size={20} className={`absolute left-4 top-3.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-12 py-3 outline-none transition font-medium ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-4 top-3.5 p-1 rounded transition hover:bg-gray-600/20`}
              >
                <X size={16} className={isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="max-w-7xl mx-auto">
        {filteredAndSortedNotes.length > 0 ? (
          <div className="grid lg:grid-cols-5 gap-0 min-h-screen">
            {/* Left Panel - Notes List */}
            <div className={`lg:col-span-2 border-r ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
              <div className="sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="p-6 space-y-4">
                  {filteredAndSortedNotes.map((note) => {
                    const isSelected = selectedNote === note.id
                    const preview = note.summary ? (note.summary.length > 100 ? note.summary.slice(0, 100) + '...' : note.summary) : 'No summary available'

                    return (
                      <article
                        key={note.id}
                        onClick={() => setSelectedNote(note.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                          isSelected 
                            ? isDarkMode 
                              ? 'bg-gray-700 border-gray-600 shadow-lg' 
                              : 'bg-blue-50 border-blue-200 shadow-md'
                            : isDarkMode 
                              ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600' 
                              : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Note Icon/Image */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                            {note.image ? (
                              <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <Calendar className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-grow min-w-0">
                            <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                              {note.title}
                            </h3>
                            <p className={`text-xs leading-relaxed mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {preview}
                            </p>
                            {note.createdAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 opacity-60" />
                                <time className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {new Date(note.createdAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: '2-digit'
                                  })}
                                </time>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Panel - Note Details */}
            <div className="lg:col-span-3">
              {currentNote ? (
                <div className="p-8 h-full overflow-y-auto">
                  <article className="max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        {currentNote.createdAt && (
                          <time className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                            {new Date(currentNote.createdAt).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </time>
                        )}
                      </div>
                      
                      <h1 className="text-3xl font-bold leading-tight mb-4">
                        {currentNote.title}
                      </h1>

                      {/* Image */}
                      {currentNote.image && (
                        <div className="rounded-xl overflow-hidden mb-6 shadow-lg">
                          <img 
                            src={currentNote.image} 
                            alt={currentNote.title} 
                            className="w-full h-80 object-cover" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`max-w-none ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      <div className="space-y-6">
                        {currentNote.summary ? (
                          currentNote.summary.split('\n').map((paragraph, index) => {
                            // Skip empty lines
                            if (!paragraph.trim()) return null;
                            
                            // Handle headers (lines starting with #)
                            if (paragraph.startsWith('#')) {
                              const level = paragraph.match(/^#+/)?.[0].length || 1;
                              const text = paragraph.replace(/^#+\s*/, '');
                              const HeaderTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
                              
                              return (
                                <HeaderTag
                                  key={index}
                                  className={`font-bold ${
                                    level === 1 ? 'text-2xl mb-4' :
                                    level === 2 ? 'text-xl mb-3' :
                                    level === 3 ? 'text-lg mb-2' :
                                    'text-base mb-2'
                                  } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                >
                                  {text}
                                </HeaderTag>
                              );
                            }
                            
                            // Handle code blocks (lines starting with multiple spaces or tabs)
                            if (paragraph.match(/^\s{4,}/) || paragraph.startsWith('\t')) {
                              return (
                                <pre
                                  key={index}
                                  className={`p-4 rounded-lg overflow-x-auto text-sm font-mono ${
                                    isDarkMode 
                                      ? 'bg-gray-800 text-green-400 border border-gray-700' 
                                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                                  }`}
                                >
                                  <code>{paragraph.trim()}</code>
                                </pre>
                              );
                            }
                            
                            // Handle numbered lists (lines starting with numbers)
                            if (paragraph.match(/^\d+\.\s/)) {
                              return (
                                <div
                                  key={index}
                                  className={`flex gap-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                                >
                                  <span className={`font-semibold min-w-[2rem] ${
                                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                  }`}>
                                    {paragraph.match(/^\d+/)?.[0]}.
                                  </span>
                                  <span className="leading-relaxed">
                                    {paragraph.replace(/^\d+\.\s*/, '')}
                                  </span>
                                </div>
                              );
                            }
                            
                            // Handle bullet points (lines starting with - or *)
                            if (paragraph.match(/^[-*]\s/)) {
                              return (
                                <div
                                  key={index}
                                  className={`flex gap-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                                >
                                  <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${
                                    isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                                  }`}></span>
                                  <span className="leading-relaxed">
                                    {paragraph.replace(/^[-*]\s*/, '')}
                                  </span>
                                </div>
                              );
                            }
                            
                            // Handle inline code (text with backticks)
                            const processInlineCode = (text: string) => {
                              const parts = text.split(/(`[^`]+`)/);
                              return parts.map((part, partIndex) => {
                                if (part.startsWith('`') && part.endsWith('`')) {
                                  return (
                                    <code
                                      key={partIndex}
                                      className={`px-2 py-1 rounded text-sm font-mono ${
                                        isDarkMode 
                                          ? 'bg-gray-800 text-yellow-400 border border-gray-700' 
                                          : 'bg-gray-100 text-red-600 border border-gray-200'
                                      }`}
                                    >
                                      {part.slice(1, -1)}
                                    </code>
                                  );
                                }
                                return part;
                              });
                            };
                            
                            // Regular paragraphs
                            return (
                              <p
                                key={index}
                                className={`leading-relaxed text-base ${
                                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                }`}
                              >
                                {processInlineCode(paragraph)}
                              </p>
                            );
                          }).filter(Boolean)
                        ) : (
                          <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No content available for this note.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => navigate(`/notes/${currentNote.id}`)}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                          isDarkMode
                            ? 'bg-white text-gray-900 hover:bg-gray-100'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        Open Full View
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-16">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <Calendar className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Select a note to view details
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Click on any note from the list to read its content
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center py-16">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <Search className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchQuery ? `No notes found matching "${searchQuery}"` : 'No notes available'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
