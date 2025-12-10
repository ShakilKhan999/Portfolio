import React, { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'

export default function Projects() {
  const projects = useAppSelector((state) => state.portfolio.projects)
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const featuredProjects = projects.filter(p => p.featured).slice(0, 4)
  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLDivElement>(null)

  console.log(featuredProjects);
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleProjects(new Set(featuredProjects.map(p => p.id)))
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
  }, [featuredProjects])

  return (
    <section id="projects" className="py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="w-full">
        <div className="text-center mb-16">
          <h2 
            className="text-5xl font-bold mb-4"
            style={{
              animation: 'slideUp 0.8s ease-out forwards',
            }}
          >
            Featured Projects
          </h2>
          <p 
            className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            style={{
              animation: 'fadeIn 0.8s ease-out 0.2s forwards',
              opacity: 0,
            }}
          >
            Apps built from concept to launch, published on App Store & Play Store
          </p>
        </div>

        <div ref={sectionRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`relative rounded-2xl overflow-hidden transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-white/[0.12] shadow-2xl shadow-black/40'
                  : 'bg-black/[0.08] shadow-2xl shadow-black/20'
              }`}
              style={{
                animation: visibleProjects.has(project.id) ? `slideInRight 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                opacity: visibleProjects.has(project.id) ? 1 : 0,
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
                <div className="relative overflow-hidden h-56">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {(project.appStore || project.playStore) && (
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-white/20 text-white' : 'bg-black text-white'}`}>
                    Published
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-2 flex-wrap">
                  {project.appStore && (
                    <a
                      href={project.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs px-3 py-2 rounded-full transition-all ${
                        isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                      }`}
                    >
                      App Store
                    </a>
                  )}
                  {project.playStore && (
                    <a
                      href={project.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs px-3 py-2 rounded-full transition-all ${
                        isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                      }`}
                    >
                      Play Store
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs px-3 py-2 rounded-full transition-all flex items-center gap-1 ${
                        isDarkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                    >
                      <ExternalLink size={12} /> GitHub
                    </a>
                  )}
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Projects Link */}
        <div className="text-center mt-12">
          <button className={`px-8 py-3 rounded-full border transition-all ${
            isDarkMode ? 'border-white/40 text-white hover:bg-white hover:text-black' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
          }`}>
            View All Projects
          </button>
        </div>
      </div>
    </section>
  )
}
