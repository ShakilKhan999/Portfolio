import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { CheckCircle2 } from 'lucide-react'

export default function AboutMe() {
  const aboutMe = useAppSelector((state) => state.portfolio.aboutMe)
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
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
  }, [])

  if (!aboutMe) return null

  return (
    <section id="about" className="py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-5xl font-bold mb-4"
            style={{
              animation: isVisible ? 'slideUp 0.8s ease-out forwards' : 'none',
              opacity: isVisible ? 1 : 0,
            }}
          >
            {aboutMe.title}
          </h2>
        </div>

        {/* Content */}
        <div ref={sectionRef} className="max-w-4xl mx-auto">
          <div 
            className={`relative rounded-2xl p-10 overflow-hidden ${
              isDarkMode 
                ? 'bg-white/[0.12] shadow-2xl shadow-black/40'
                : 'bg-black/[0.08] shadow-2xl shadow-black/20'
            }`}
            style={{
              animation: isVisible ? 'slideUp 0.6s ease-out 0.3s forwards' : 'none',
              opacity: isVisible ? 1 : 0,
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
              <div className="text-center">
                {/* Bio */}
                <p className={`text-lg leading-relaxed mb-8 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {aboutMe.bio}
                </p>

                {/* Highlights */}
                {aboutMe.highlights && aboutMe.highlights.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key Highlights</h3>
                    <ul className="space-y-3 text-left max-w-2xl mx-auto">
                      {aboutMe.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              isDarkMode ? 'text-white' : 'text-black'
                            }`}
                          />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
