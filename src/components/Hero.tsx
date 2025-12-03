import React, { useEffect, useRef, useState } from 'react'
import { Github, Linkedin, Mail, FileDown } from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'

export default function Hero() {
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [isVisible, setIsVisible] = useState(true)

  return (
    <section className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
      <div className="max-w-5xl mx-auto text-center">
        {/* Profile Image */}
        <div 
          className="mb-8 inline-block"
          style={{
            animation: isVisible ? 'scaleIn 0.6s ease-out forwards' : 'none',
            opacity: isVisible ? 1 : 0,
          }}
        >
          <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-gray-200 via-gray-500 to-white' : 'bg-gradient-to-br from-black via-gray-800 to-black'} p-1 shadow-soft`}>
            <div className={`w-full h-full rounded-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center text-4xl font-bold`}>
              SK
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-6xl md:text-7xl font-bold mb-6 tracking-tight"
          style={{
            animation: isVisible ? 'slideUp 0.8s ease-out 0.2s forwards' : 'none',
            opacity: 0,
          }}
        >
          Shakil Khan
        </h1>

        {/* Subtitle */}
        <p 
          className="text-xl md:text-2xl mb-4 font-semibold"
          style={{
            animation: isVisible ? 'fadeIn 0.8s ease-out 0.4s forwards' : 'none',
            opacity: 0,
          }}
        >
          Flutter Developer & Mobile Architect
        </p>

        {/* Tagline */}
        <p 
          className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          style={{
            animation: isVisible ? 'fadeIn 0.8s ease-out 0.6s forwards' : 'none',
            opacity: 0,
          }}
        >
          Crafting beautiful, performant mobile experiences with emphasis on clean architecture, user-centric design, and AI integration
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex gap-4 justify-center items-center flex-wrap mb-10"
          style={{
            animation: isVisible ? 'slideUp 0.8s ease-out 0.8s forwards' : 'none',
            opacity: 0,
          }}
        >
          <a
            href="#projects"
            className={`px-8 py-3 font-medium rounded-full transition-all hover:scale-105 ${
              isDarkMode
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-900'
            }`}
          >
            View My Work
          </a>
          <a
            href="#contact"
            className={`px-8 py-3 font-medium rounded-full border transition-all hover:scale-105 ${
              isDarkMode
                ? 'border-gray-600 text-white hover:bg-white/5'
                : 'border-gray-400 text-black hover:bg-gray-100'
            }`}
          >
            Get in Touch
          </a>
        </div>

        {/* Social Links */}
        <div 
          className="flex justify-center gap-3 flex-wrap"
          style={{
            animation: isVisible ? 'fadeIn 0.8s ease-out 1s forwards' : 'none',
            opacity: 0,
          }}
        >
          <a
            href="https://github.com/shakilkhan"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-full transition-all hover:scale-110 flex items-center gap-2 ${
              isDarkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/shakil-khan-796384200"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-full transition-all hover:scale-110 flex items-center gap-2 ${
              isDarkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            LinkedIn
          </a>
          <a
            href="mailto:shakilkhanhu@gmail.com"
            className={`px-4 py-2 rounded-full transition-all hover:scale-110 flex items-center gap-2 ${
              isDarkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            Email
          </a>
        </div>
      </div>
    </section>
  )
}
