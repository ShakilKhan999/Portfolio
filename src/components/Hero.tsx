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
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div 
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800' 
            : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
        }`}
      />
      
      {/* Decorative elements */}
      <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 ${
        isDarkMode ? 'bg-white' : 'bg-gray-400'
      }`} />
      <div className={`absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 ${
        isDarkMode ? 'bg-gray-400' : 'bg-gray-300'
      }`} />

      <style>{`
        @keyframes scaleIn {0%{transform:scale(.9);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes slideUp {0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1}}
        @keyframes fadeIn {0%{opacity:0}100%{opacity:1}}
        @keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse-ring {0%{transform:scale(1);opacity:0.4}100%{transform:scale(1.15);opacity:0}}
      `}</style>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Centered content layout */}
        <div className="flex flex-col items-center text-center">
          
          {/* Profile Image with animated ring */}
          <div
            className="mb-8 relative"
            style={{
              animation: isVisible ? 'scaleIn 0.6s cubic-bezier(.2,.9,.2,1) forwards' : 'none',
            }}
          >
            {/* Animated ring */}
            <div 
              className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden relative ring-4 ${
              isDarkMode ? 'ring-gray-800' : 'ring-white'
            } shadow-2xl`}>
              {profileImage ? (
                <img src={profileImage} alt="Shakil Khan" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center text-4xl md:text-5xl font-bold`}>
                  SK
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1
            className={`text-5xl md:text-7xl font-bold mb-4 tracking-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
            style={{
              opacity: 0,
              animation: isVisible ? 'slideUp 0.7s cubic-bezier(.2,.9,.2,1) 0.15s forwards' : 'none',
            }}
          >
            Shakil Khan
          </h1>

          {/* Title */}
          <p
            className={`text-xl md:text-2xl font-semibold mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
            style={{
              opacity: 0,
              animation: isVisible ? 'slideUp 0.7s cubic-bezier(.2,.9,.2,1) 0.25s forwards' : 'none',
            }}
          >
            Flutter Developer & Mobile Architect
          </p>

          {/* Description */}
          <p
            className={`text-base md:text-lg mb-10 max-w-xl leading-relaxed ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
            style={{
              opacity: 0,
              animation: isVisible ? 'fadeIn 0.7s ease-out 0.35s forwards' : 'none',
            }}
          >
            Crafting beautiful, performant mobile experiences with emphasis on clean architecture, user-centric design, and AI integration
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex gap-4 items-center justify-center flex-wrap mb-10"
            style={{
              opacity: 0,
              animation: isVisible ? 'slideUp 0.7s cubic-bezier(.2,.9,.2,1) 0.45s forwards' : 'none',
            }}
          >
            <a
              href="#projects"
              className={`group px-8 py-4 font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              View My Work
              <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </a>

            <a
              href="#contact"
              className={`px-8 py-4 font-semibold rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? 'border-gray-600 text-white hover:bg-white/10 hover:border-gray-400'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Get in Touch
            </a>
          </div>

          {/* Social Links */}
          <div 
            className="flex gap-4 justify-center"
            style={{
              opacity: 0,
              animation: isVisible ? 'fadeIn 0.7s ease-out 0.55s forwards' : 'none',
            }}
          >
            <a
              href="https://github.com/shakilkhan"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/shakil-khan-796384200/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="mailto:shakilkhanhu@gmail.com"
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{
          opacity: 0,
          animation: isVisible ? 'fadeIn 1s ease-out 1s forwards' : 'none',
        }}
      >
        <div 
          className={`w-6 h-10 rounded-full border-2 ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          } flex justify-center pt-2`}
        >
          <div 
            className={`w-1 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}
            style={{ animation: 'float 1.5s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  )
}
