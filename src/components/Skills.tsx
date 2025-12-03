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
    <section ref={sectionRef} className={`py-20 px-6 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className={`p-8 rounded-2xl transition-all hover:scale-105 hover:shadow-medium ${
                isDarkMode
                  ? 'bg-gray-700 border border-gray-600 hover:border-gray-500'
                  : 'bg-white border border-gray-100 hover:border-gray-200'
              }`}
              style={{
                animation: visibleSkills.has(skill.id) ? `scaleIn 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                opacity: 0,
              }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black text-white'}`}>
                {iconMap[skill.icon] || <Code2 size={28} />}
              </div>
              <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
              <p className={isDarkMode ? 'text-gray-300 text-sm' : 'text-gray-600 text-sm'}>
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
