import React, { useState, useEffect, useRef } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useAppSelector } from '../hooks/useAppSelector'
import { db } from '../config/firebase'

export default function Contact() {
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
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
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields')
      return
    }

    try {
      setSending(true)
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: Date.now(),
        read: false,
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Failed to send message', error)
      alert('Something went wrong while sending your message. Please try again later.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section ref={sectionRef} id="contact" className={`py-20 px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 
            className="text-5xl font-bold mb-4"
            style={{
              animation: isVisible ? 'slideUp 0.8s ease-out forwards' : 'none',
              opacity: isVisible ? 1 : 0,
            }}
          >
            Let's Connect
          </h2>
          <p 
            className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            style={{
              animation: isVisible ? 'fadeIn 0.8s ease-out 0.2s forwards' : 'none',
              opacity: isVisible ? 1 : 0,
            }}
          >
            Have a project idea? Let's discuss and build something amazing together.
          </p>
        </div>

        {/* Contact Form */}
        <div 
          className={`rounded-2xl p-10 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-100'}`}
          style={{
            animation: isVisible ? 'slideUp 0.6s ease-out 0.3s forwards' : 'none',
            opacity: isVisible ? 1 : 0,
          }}
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Thanks for reaching out. I'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-5 py-3 rounded-xl transition-all ${
                      isDarkMode
                        ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-white border border-gray-300 text-black focus:border-gray-900'
                    } focus:outline-none focus:ring-1 ${isDarkMode ? 'focus:ring-white' : 'focus:ring-gray-900'}`}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-5 py-3 rounded-xl transition-all ${
                      isDarkMode
                        ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-white border border-gray-300 text-black focus:border-gray-900'
                    } focus:outline-none focus:ring-1 ${isDarkMode ? 'focus:ring-white' : 'focus:ring-gray-900'}`}
                />
              </div>
              <div>
                <textarea
                  placeholder="Tell me about your project or idea"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-5 py-3 rounded-xl transition-all resize-none ${
                      isDarkMode
                        ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-white border border-gray-300 text-black focus:border-gray-900'
                    } focus:outline-none focus:ring-1 ${isDarkMode ? 'focus:ring-white' : 'focus:ring-gray-900'}`}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className={`w-full px-8 py-3 rounded-full font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="text-center mt-10">
          <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Or reach out directly:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="mailto:shakilkhanhu@gmail.com"
              className={`font-medium ${isDarkMode ? 'text-white hover:text-gray-200' : 'text-gray-900 hover:text-black'}`}
            >
              shakilkhanhu@gmail.com
            </a>
            <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
            <a
              href="tel:+8801647383443"
              className={`font-medium ${isDarkMode ? 'text-white hover:text-gray-200' : 'text-gray-900 hover:text-black'}`}
            >
              +880 1647-383-443
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
