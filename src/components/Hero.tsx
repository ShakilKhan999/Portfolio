import React, { useEffect, useState } from 'react'
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

export default function Hero() {
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [isVisible, setIsVisible] = useState(true)
  const [cvLink, setCvLink] = useState('')
  const [profileImage, setProfileImage] = useState('')

  useEffect(() => {
    let mounted = true
    const fetchMeta = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteMeta', 'global'))
        if (!mounted) return
        if (snap.exists()) {
          const data = snap.data() as any
          setCvLink(data.cvLink ?? '')
          setProfileImage(data.profileImage ?? '')
        }
      } catch (err) {
        // silent
      }
    }
    fetchMeta()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center py-12 relative overflow-hidden">
      <style>{`
        @keyframes scaleIn {0%{transform:scale(.9);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes slideUp {0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1}}
        @keyframes fadeIn {0%{opacity:0}100%{opacity:1}}
        @keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse-ring {0%{transform:scale(1);opacity:0.4}100%{transform:scale(1.15);opacity:0}}
      `}</style>

      <div className="w-full relative z-10 px-4 md:px-8 lg:px-12">
        {/* Professional two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh]">
          
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">

            {/* Glass morphism content container - ENHANCED FROSTED EFFECT */}
            <div 
              className={`relative p-8 rounded-3xl overflow-hidden group ${
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
              {/* Subtle gradient overlay inside glass */}
              <div className={`absolute inset-0 rounded-3xl pointer-events-none ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-white/[0.1] via-white/[0.05] to-transparent' 
                  : 'bg-gradient-to-br from-white/80 via-white/50 to-white/30'
              }`} />
              
              {/* Inner border shine effect */}
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.15)' 
                    : '1px solid rgba(255, 255, 255, 0.7)'
                }}
              />
              
              {/* Professional typography hierarchy */}
              <div className="space-y-6 relative z-10">
                <div>
                  <p className={`text-sm font-medium tracking-wide uppercase mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Hello, I'm
                  </p>
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Shakil Khan
                  </h1>
                </div>
                
                <h2 className={`text-xl md:text-2xl font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Flutter Developer & Mobile Architect
                </h2>
                
                <p className={`text-lg leading-relaxed max-w-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  I craft beautiful, performant mobile experiences with emphasis on clean architecture, user-centric design, and AI integration.
                </p>
              </div>
            </div>

            {/* Glass morphism CTA buttons */}
            <div 
              className="flex gap-4 items-start flex-wrap pt-6"
              style={{
                opacity: 0,
                animation: isVisible ? 'slideUp 0.7s cubic-bezier(.2,.9,.2,1) 0.45s forwards' : 'none',
              }}
            >
              <a
                href="#projects"
                className={`group inline-flex items-center gap-2 px-6 py-3 font-medium rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-white/90 text-gray-900 hover:bg-white border border-white/20 shadow-lg hover:shadow-xl hover:shadow-white/20'
                    : 'bg-gray-900/90 text-white hover:bg-gray-900 border border-gray-900/20 shadow-lg hover:shadow-xl hover:shadow-gray-900/20'
                }`}
              >
                View My Work
                <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className={`px-6 py-3 font-medium rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-white/5 border-white/20 text-gray-200 hover:bg-white/10 hover:border-white/30 shadow-lg hover:shadow-xl hover:shadow-white/10'
                    : 'bg-white/30 border-gray-300/50 text-gray-800 hover:bg-white/50 hover:border-gray-400/60 shadow-lg hover:shadow-xl hover:shadow-gray-900/10'
                }`}
              >
                Get in Touch
              </a>
            </div>

            {/* Glass morphism social links */}
            <div className="flex gap-3 pt-6">
              <a
                href="https://github.com/ShakilKhan999"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 shadow-lg hover:shadow-white/5'
                    : 'bg-white/30 border border-white/40 text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:border-white/60 shadow-lg hover:shadow-gray-900/5'
                }`}
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/shakil-khan-796384200/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 shadow-lg hover:shadow-white/5'
                    : 'bg-white/30 border border-white/40 text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:border-white/60 shadow-lg hover:shadow-gray-900/5'
                }`}
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:shakilkhanhu@gmail.com"
                className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 shadow-lg hover:shadow-white/5'
                    : 'bg-white/30 border border-white/40 text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:border-white/60 shadow-lg hover:shadow-gray-900/5'
                }`}
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          </div>
          
          {/* Right Column - Glass morphism Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Decorative glow background */}
              <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-white/20 to-white/10' 
                  : 'bg-gradient-to-br from-black/10 to-black/5'
              }`} />
              
              {/* Glass morphism frame - ENHANCED FROSTED EFFECT */}
              <div 
                className={`relative w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden ${
                  isDarkMode 
                    ? 'bg-white/[0.12] shadow-2xl shadow-black/50' 
                    : 'bg-black/[0.08] shadow-2xl shadow-black/20'
                }`}
                style={{
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.25)' 
                    : '1px solid rgba(0, 0, 0, 0.12)'
                }}
              >
                {/* Inner shine layer */}
                <div className={`absolute inset-0 rounded-3xl pointer-events-none ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-transparent' 
                    : 'bg-gradient-to-br from-white/70 via-white/40 to-white/20'
                }`} />
                
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Shakil Khan" 
                    className="w-full h-full object-cover relative z-10" 
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-6xl md:text-7xl lg:text-8xl font-bold relative z-10 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    SK
                  </div>
                )}
              </div>
              
              {/* Glass morphism badge */}
              <div className={`absolute -bottom-4 -right-4 px-4 py-2 rounded-xl backdrop-blur-lg border z-20 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-white/95 to-white/80 text-gray-900 border-white/40 shadow-lg shadow-white/30' 
                  : 'bg-gradient-to-br from-white/90 to-white/80 text-gray-900 border-white/80 shadow-xl shadow-gray-900/15'
              }`}>
                <span className="text-sm font-semibold">Available for hire</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}
