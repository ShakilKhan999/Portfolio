import React, { useLayoutEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'

export default function NotePage() {
  const { id } = useParams()
  const notes = useAppSelector((s) => s.portfolio.notes)
  const caseStudies = useAppSelector((s) => s.portfolio.caseStudies)
  const isDarkMode = useAppSelector((s) => s.ui.isDarkMode)

  // Instant scroll to top without animation when component mounts
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  const note = notes.find((n) => n.id === id) || caseStudies.find((c) => c.id === id)

  if (!note) {
    return (
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Note not found</h2>
          <Link to="/" className="text-sm text-blue-600">Back to home</Link>
        </div>
      </div>
    )
  }

  const created = note.createdAt ? new Date(note.createdAt).toLocaleString() : ''

  return (
    <section className={`min-h-screen pt-24 pb-16 px-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="article-container">
        <Link to="/#field-notes" className="inline-flex items-center gap-2 mb-8 text-sm font-medium hover:opacity-70 transition">
          <span>←</span> Back to Field Notes
        </Link>

        <div className="article-grid">
          <aside className="article-side">
            <div className="sticky top-24">
              <div className="mb-8">
                <h3 className="text-base font-semibold mb-2">Field Notes</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notes and solved issues from real work — concise problem/solution writeups</p>
              </div>
              <button className={`text-sm px-4 py-2 rounded-full transition ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                Follow
              </button>
            </div>
          </aside>

          <div className="article-main">

            <h1 className="article-title">{note.title}</h1>
            {created && <div className={`article-meta mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{created}</div>}

            {note.image && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
                <img src={note.image} alt={note.title} className="w-full h-80 object-cover" />
              </div>
            )}

            <article className="article-content space-y-6">
              {note.summary ? (
                note.summary.split('\n').map((paragraph: string, index: number) => {
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
                          level === 1 ? 'text-3xl mb-6 mt-8' :
                          level === 2 ? 'text-2xl mb-4 mt-6' :
                          level === 3 ? 'text-xl mb-3 mt-4' :
                          'text-lg mb-2 mt-3'
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
                        className={`flex gap-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
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
                        className={`flex gap-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
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
                      className={`leading-relaxed text-lg ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {processInlineCode(paragraph)}
                    </p>
                  );
                }).filter(Boolean)
              ) : (
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No content available for this note.
                </p>
              )}
            </article>

            {note.link && (
              <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
                <a 
                  href={note.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'}`}
                >
                  View Original Source
                  <span>→</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
