import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

export default function Experience() {
  const experiences = useAppSelector((state) => state.portfolio.experiences)
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [visibleExperiences, setVisibleExperiences] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLDivElement>(null)

  // Sort experiences by date (most recent first)
  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.current) return -1
    if (b.current) return 1
    const dateA = new Date(a.startDate).getTime()
    const dateB = new Date(b.startDate).getTime()
    return dateB - dateA
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleExperiences(new Set(experiences.map(exp => exp.id)))
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
  }, [experiences])

  if (experiences.length === 0) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <section id="experience" className="py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-5xl font-bold mb-4"
            style={{
              animation: 'slideUp 0.8s ease-out forwards',
            }}
          >
            Experience
          </h2>
          <p 
            className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            style={{
              animation: 'fadeIn 0.8s ease-out 0.2s forwards',
              opacity: 0,
            }}
          >
            My professional journey and career milestones
          </p>
        </div>

        {/* Timeline */}
        <div ref={sectionRef} className="relative">
          {/* Vertical line */}
          <div 
            className={`absolute left-8 top-0 bottom-0 w-0.5 ${
              isDarkMode ? 'bg-white/20' : 'bg-black/10'
            }`}
          />

          {/* Experience items */}
          <div className="space-y-12">
            {sortedExperiences.map((exp, index) => {
              const isVisible = visibleExperiences.has(exp.id)
              
              return (
                <div
                  key={exp.id}
                  className="relative pl-20"
                  style={{
                    animation: isVisible ? `slideInRight 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  {/* Timeline dot */}
                  <div 
                    className={`absolute left-6 top-6 w-5 h-5 rounded-full border-4 ${
                      exp.current 
                        ? isDarkMode 
                          ? 'bg-white border-white shadow-lg shadow-white/50' 
                          : 'bg-black border-black shadow-lg shadow-black/30'
                        : isDarkMode
                          ? 'bg-gray-900 border-white/40'
                          : 'bg-white border-black/20'
                    }`}
                    style={{
                      animation: exp.current ? 'pulse 2s ease-in-out infinite' : 'none',
                    }}
                  />

                  {/* Content card */}
                  <div
                    className={`relative rounded-2xl p-6 overflow-hidden transition-all hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-white/[0.12] shadow-2xl shadow-black/40'
                        : 'bg-black/[0.08] shadow-2xl shadow-black/20'
                    }`}
                    style={{
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
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Briefcase className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                            <h3 className="text-xl font-semibold">{exp.position}</h3>
                          </div>
                          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {exp.company}
                          </p>
                        </div>
                        {exp.current && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
                          }`}>
                            Current
                          </span>
                        )}
                      </div>

                      {/* Date and location */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className={`flex items-center gap-2 text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                          </span>
                        </div>
                        {exp.location && (
                          <div className={`flex items-center gap-2 text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <MapPin className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className={`mb-4 leading-relaxed ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {exp.description}
                      </p>

                      {/* Technologies */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                isDarkMode 
                                  ? 'bg-white/10 text-gray-300' 
                                  : 'bg-black/5 text-gray-700'
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
