import React, { useEffect, useRef, useState } from 'react'
import { Smartphone, Layers, Code2, Database, Brain, Box } from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'

const iconMap: Record<string, React.ReactNode> = {
  smartphone: <Smartphone size={28} />,
  layers: <Layers size={28} />,
  code: <Code2 size={28} />,
  database: <Database size={28} />,
  brain: <Brain size={28} />,
  box: <Box size={28} />,
}

export default function Skills() {
  const skills = useAppSelector((state) => state.portfolio.skills)
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [visibleSkills, setVisibleSkills] = useState<Set<string>>(new Set())
  const sectionRef = useRef<any>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger all skills animations
          setVisibleSkills(new Set(skills.map(s => s.id)))
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
  }, [skills])

  return (
    <section ref={sectionRef} className="py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="w-full relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 
            className="text-5xl font-bold mb-4"
            style={{
              animation: 'slideUp 0.8s ease-out forwards',
            }}
          >
            Skills & Expertise
          </h2>
          <p 
            className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            style={{
              animation: 'fadeIn 0.8s ease-out 0.2s forwards',
              opacity: 0,
            }}
          >
            Technologies and practices I've mastered
          </p>
        </div>

        {/* Skills Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                className={`relative p-6 rounded-2xl transition-all hover:scale-105 overflow-hidden ${
                  isDarkMode
                    ? 'bg-white/[0.12] shadow-2xl shadow-black/40'
                    : 'bg-black/[0.08] shadow-2xl shadow-black/20'
                }`}
                style={{
                  animation: visibleSkills.has(skill.id) ? `scaleIn 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                  opacity: 0,
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
              
              <div className="relative z-10 text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/80 text-white'}`}>
                  {iconMap[skill.icon] || <Code2 size={24} />}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{skill.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-300 text-xs' : 'text-gray-700 text-xs'}`}>
                  {skill.description}
                </p>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
