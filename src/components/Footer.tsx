import React from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'

export default function Footer() {
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`border-t py-12 px-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <h3 className="text-xl font-bold mb-2">SK</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Flutter Developer creating beautiful mobile experiences with clean code and innovative design.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#projects" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Projects
                </a>
              </li>
              <li>
                <a href="#case-studies" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#contact" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/ShakilKhan999" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/shakil-khan-796384200/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:shakilkhanhu@gmail.com" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={`border-t pt-8 text-center text-sm ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
          <p>© {currentYear} Shakil Khan. All rights reserved. Built with React, Tailwind CSS, Three.js, and Redux.</p>
        </div>
      </div>
    </footer>
  )
}
