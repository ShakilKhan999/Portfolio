import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export default function CaseStudies() {
  const notes = useAppSelector((state) => state.portfolio.notes)
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [visibleNotes, setVisibleNotes] = useState<Set<string>>(new Set())
  
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLDivElement>(null)

  // Sort notes by latest first and show only 4 for homepage
  const displayedNotes = useMemo(() => {
    if (!notes || notes.length === 0) return []
    
    // Sort by createdAt (latest first) and take first 4
    return [...notes].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    }).slice(0, 4)
  }, [notes])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleNotes(new Set(displayedNotes.map(note => note.id)))
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [displayedNotes])

  return (
    <section id="field-notes" className="py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Field Notes
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Notes and solved issues from real work — concise problem/solution writeups
          </p>
        </div>

        {/* Content */}
        <div ref={sectionRef}>
          {displayedNotes.length > 0 ? (
            <>
              {/* Notes Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {displayedNotes.map((note, idx) => {
                  const isVisible = visibleNotes.has(note.id)
                  const preview = note.summary ? (note.summary.length > 150 ? note.summary.slice(0, 150) + '...' : note.summary) : 'No summary available'

                  return (
                    <article 
                      key={note.id} 
                      onClick={() => navigate(`/notes/${note.id}`)}
                      className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      } ${
                        isDarkMode 
                          ? 'bg-white/[0.12] shadow-2xl shadow-black/40'
                          : 'bg-black/[0.08] shadow-2xl shadow-black/20'
                      }`}
                      style={{ 
                        animationDelay: `${idx * 150}ms`,
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: isDarkMode 
                          ? '1px solid rgba(255, 255, 255, 0.2)' 
                          : '1px solid rgba(0, 0, 0, 0.12)'
                      }}
                    >
                      {/* Inner gradient overlay */}
                      <div className={`absolute inset-0 rounded-2xl pointer-events-none ${
                        isDarkMode 
                          ? 'bg-gradient-to-br from-white/[0.1] via-white/[0.05] to-transparent' 
                          : 'bg-gradient-to-br from-white/80 via-white/50 to-white/30'
                      }`} />
                      
                      {/* Inner border shine */}
                      <div 
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          border: isDarkMode 
                            ? '1px solid rgba(255, 255, 255, 0.15)' 
                            : '1px solid rgba(255, 255, 255, 0.7)'
                        }}
                      />
                      
                      <div className="relative z-10">
                      {/* Image */}
                      <div className="relative overflow-hidden h-48">
                        {note.image ? (
                          <img 
                            src={note.image} 
                            alt={note.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                          }`}>
                            <div className={`text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Field Note</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Date Badge */}
                        {note.createdAt && (
                          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                            isDarkMode ? 'bg-black/60 text-white' : 'bg-white/90 text-gray-700'
                          }`}>
                            {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {note.title}
                        </h3>
                        
                        <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {preview}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 opacity-60" />
                            <span className={`text-xs ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {note.createdAt ? 
                                new Date(note.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                }) : 
                                'Recent'
                              }
                            </span>
                          </div>
                          
                          <ArrowRight className={`w-4 h-4 transform group-hover:translate-x-1 transition-transform ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        </div>
                      </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* View All Notes Button */}
              {notes && notes.length > 3 && (
                <div className="text-center">
                  <button
                    onClick={() => navigate('/all-notes')}
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode
                        ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    View All Notes
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Calendar className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No Field Notes available yet.
              </p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Check back soon for development insights and solutions.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
