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
      {/* Clean professional background */}
      <div 
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gray-900' 
            : 'bg-white'
        }`}
      />

      <style>{`
        @keyframes scaleIn {0%{transform:scale(.9);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes slideUp {0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1}}
        @keyframes fadeIn {0%{opacity:0}100%{opacity:1}}
        @keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse-ring {0%{transform:scale(1);opacity:0.4}100%{transform:scale(1.15);opacity:0}}
      `}</style>

      <div className="max-w-7xl mx-auto w-full relative z-10 px-6">
        {/* Professional two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">

            {/* Glass morphism content container */}
            <div className={`relative p-8 rounded-3xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-white/10 border-white/20 shadow-2xl shadow-black/30' 
                : 'bg-white/60 border-white/80 shadow-2xl shadow-gray-900/10'
            }`}>
              {/* Professional typography hierarchy */}
              <div className="space-y-6">
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
            <div className="relative">
              {/* Glass morphism frame */}
              <div className={`w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden backdrop-blur-xl border ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 shadow-2xl shadow-black/30' 
                  : 'bg-white/60 border-white/80 shadow-2xl shadow-gray-900/10'
              }`}>
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Shakil Khan" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-6xl md:text-7xl lg:text-8xl font-bold ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    SK
                  </div>
                )}
              </div>
              
              {/* Glass morphism badge */}
              <div className={`absolute -bottom-4 -right-4 px-4 py-2 rounded-xl backdrop-blur-md border ${
                isDarkMode 
                  ? 'bg-white/90 text-gray-900 border-white/20 shadow-lg shadow-white/20' 
                  : 'bg-gray-900/90 text-white border-gray-900/20 shadow-lg shadow-gray-900/20'
              }`}>
                <span className="text-sm font-medium">Available for hire</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}
