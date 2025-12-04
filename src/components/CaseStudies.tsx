import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'

export default function CaseStudies() {
  const caseStudies = useAppSelector((state) => state.portfolio.caseStudies)
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [visibleStudies, setVisibleStudies] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleStudies(new Set(caseStudies.map(s => s.id)))
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
  }, [caseStudies])

  return (
    <section id="field-notes" className={`py-20 px-6 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-5xl font-bold mb-4"
            style={{
              animation: 'slideUp 0.8s ease-out forwards',
            }}
          >
            Field Notes
          </h2>
          <p 
            className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            style={{
              animation: 'fadeIn 0.8s ease-out 0.2s forwards',
              opacity: 0,
            }}
          >
            Notes and solved issues from real work — concise problem/solution writeups
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {['All', ...Array.from(new Set(caseStudies.flatMap(s => s.categories ?? [])))]
            .map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === cat ? 'ring-2 ring-pink-400 bg-pink-50 text-pink-600' : isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-black'}`}
              >
                {cat}
              </button>
            ))}
        </div>

        <div ref={sectionRef} className="space-y-16">
          {caseStudies
            .filter(s => activeCategory === 'All' || (s.categories ?? []).includes(activeCategory))
            .map((study, index) => (
            <div 
              key={study.id} 
              className={`grid md:grid-cols-2 gap-10 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
              style={{
                animation: visibleStudies.has(study.id) ? `${index % 2 === 0 ? 'slideInLeft' : 'slideInRight'} 0.6s ease-out ${index * 0.2}s forwards` : 'none',
                opacity: visibleStudies.has(study.id) ? 1 : 0,
              }}
            >
              {/* Image */}
              <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                <div className={`rounded-2xl overflow-hidden ${isDarkMode ? 'shadow-lg' : 'shadow-soft'}`}>
                  <img src={study.image} alt={study.title} className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-white/15 text-white' : 'bg-black text-white'}`}>
                    {study.client}
                  </div>
                  {/* categories tags */}
                  <div className="flex gap-2 flex-wrap">
                    {(study.categories ?? []).map((c) => (
                      <span key={c} className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-black'}`}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-4xl font-bold">{study.title}</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-base mb-2">Challenge</h4>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">Solution</h4>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">Impact</h4>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{study.impact}</p>
                  </div>
                </div>

                <button className={`px-6 py-3 rounded-full font-medium transition-all hover:scale-105 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}>
                  Read Full Case Study
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
