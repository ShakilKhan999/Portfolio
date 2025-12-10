import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { toggleDarkMode, setMobileMenuOpen } from '../store/slices/uiSlice'
import { useAppSelector } from '../hooks/useAppSelector'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

interface NavigationProps {
  onAdminAccess: () => void
}

export default function Navigation({ onAdminAccess }: NavigationProps) {
  const dispatch = useDispatch()
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen)
  const [isScrolled, setIsScrolled] = useState(false)
  const tapCountRef = useRef(0)
  const tapTimeoutRef = useRef<number | null>(null)
  const [cvLink, setCvLink] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let mounted = true
    const fetchMeta = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteMeta', 'global'))
        if (!mounted) return
        if (snap.exists()) {
          const data = snap.data() as any
          setCvLink(data.cvLink ?? '')
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

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        window.clearTimeout(tapTimeoutRef.current)
      }
    }
  }, [])

  const handleSecretLogoTap = () => {
    tapCountRef.current += 1

    if (tapTimeoutRef.current) {
      window.clearTimeout(tapTimeoutRef.current)
    }

    tapTimeoutRef.current = window.setTimeout(() => {
      tapCountRef.current = 0
    }, 600)

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0
      onAdminAccess()
    }
  }

  const navItems = [
    { label: 'Projects', href: '#projects' },
    { label: 'Field Notes', href: '#field-notes' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? 'bg-gray-900/95 border-b border-gray-800'
            : 'bg-white/95 border-b border-gray-200'
          : isDarkMode
          ? 'bg-transparent'
          : 'bg-white/50'
      } backdrop-blur-xl`}
    >
      <div className="w-full px-4 md:px-8 lg:px-12 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="text-xl font-semibold tracking-tight select-none"
            onClick={handleSecretLogoTap}
          >
            SK
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {/* Hire me CTA in header */}
            <a
              href={cvLink || '#'}
              target="_blank"
              rel="noreferrer"
              className={`px-4 py-2 font-medium rounded-full transition-all inline-block ${cvLink ? (isDarkMode ? 'border-2 border-white text-white hover:bg-white hover:text-black' : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white') : 'opacity-60 pointer-events-none bg-transparent border'}`}
            >
              Hire me
            </a>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
              </a>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`p-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
                isDarkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex gap-3 items-center">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`p-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
                isDarkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => dispatch(setMobileMenuOpen(!isMobileMenuOpen))}
              className={`p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 space-y-3 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} pt-4`}>
            <div className="px-2">
              <a
                href={cvLink || '#'}
                target="_blank"
                rel="noreferrer"
                className={`inline-block px-4 py-2 mb-2 font-medium rounded-full ${cvLink ? (isDarkMode ? 'border-2 border-white text-white' : 'border-2 border-gray-900 text-gray-900') : 'opacity-60 pointer-events-none bg-transparent border'}`}
              >
                Hire me
              </a>
            </div>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`block text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
