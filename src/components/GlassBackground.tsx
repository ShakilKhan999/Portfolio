import React from 'react'
import { useAppSelector } from '../hooks/useAppSelector'

interface GlassBackgroundProps {
  variant?: 'hero' | 'skills' | 'projects' | 'case-studies' | 'contact'
}

export default function GlassBackground({ variant = 'hero' }: GlassBackgroundProps) {
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)
  
  // Different blob positions for each section for variety
  const blobConfigs = {
    hero: {
      blobs: [
        { cx: 200, cy: 150, rx: 400, ry: 320, grad: 1, blur: 3 },
        { cx: 1250, cy: 750, rx: 350, ry: 400, grad: 2, blur: 2 },
        { cx: 1100, cy: 300, rx: 250, ry: 220, grad: 3, blur: 2 },
        { cx: 300, cy: 700, rx: 220, ry: 250, grad: 1, blur: 1, opacity: 0.8 },
        { cx: 720, cy: 100, rx: 300, ry: 180, grad: 3, blur: 3, opacity: 0.6 },
        { cx: 100, cy: 450, rx: 180, ry: 160, grad: 2, blur: 2, opacity: 0.7 },
      ]
    },
    skills: {
      blobs: [
        { cx: 300, cy: 200, rx: 380, ry: 300, grad: 1, blur: 3 },
        { cx: 1150, cy: 700, rx: 320, ry: 380, grad: 2, blur: 2 },
        { cx: 1000, cy: 250, rx: 230, ry: 200, grad: 3, blur: 2 },
        { cx: 200, cy: 600, rx: 200, ry: 230, grad: 1, blur: 1, opacity: 0.8 },
        { cx: 700, cy: 150, rx: 280, ry: 160, grad: 3, blur: 3, opacity: 0.6 },
      ]
    },
    projects: {
      blobs: [
        { cx: 250, cy: 250, rx: 350, ry: 300, grad: 2, blur: 3 },
        { cx: 1200, cy: 650, rx: 380, ry: 350, grad: 1, blur: 2 },
        { cx: 900, cy: 200, rx: 240, ry: 220, grad: 3, blur: 2 },
        { cx: 400, cy: 700, rx: 210, ry: 240, grad: 2, blur: 1, opacity: 0.8 },
        { cx: 1100, cy: 100, rx: 270, ry: 170, grad: 1, blur: 3, opacity: 0.6 },
      ]
    },
    'case-studies': {
      blobs: [
        { cx: 180, cy: 300, rx: 370, ry: 310, grad: 3, blur: 3 },
        { cx: 1280, cy: 600, rx: 340, ry: 390, grad: 1, blur: 2 },
        { cx: 950, cy: 280, rx: 250, ry: 210, grad: 2, blur: 2 },
        { cx: 350, cy: 650, rx: 190, ry: 220, grad: 3, blur: 1, opacity: 0.8 },
        { cx: 650, cy: 120, rx: 290, ry: 150, grad: 2, blur: 3, opacity: 0.6 },
      ]
    },
    contact: {
      blobs: [
        { cx: 220, cy: 180, rx: 360, ry: 320, grad: 1, blur: 3 },
        { cx: 1220, cy: 720, rx: 330, ry: 370, grad: 3, blur: 2 },
        { cx: 1050, cy: 220, rx: 260, ry: 200, grad: 2, blur: 2 },
        { cx: 280, cy: 680, rx: 200, ry: 240, grad: 1, blur: 1, opacity: 0.8 },
        { cx: 750, cy: 130, rx: 270, ry: 170, grad: 3, blur: 3, opacity: 0.6 },
      ]
    }
  }

  const blobs = blobConfigs[variant]

  return (
    <>
      {/* Pure white/black base background */}
      <div 
        className={`fixed inset-0 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
        style={{ zIndex: 0 }}
      />

      {/* Abstract gradient blob vectors - background layer */}
      <svg 
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1, opacity: isDarkMode ? 0.25 : 0.22 }} 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id={`${variant}Blur1`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </filter>
          <filter id={`${variant}Blur2`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="70" />
          </filter>
          <filter id={`${variant}Blur3`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="90" />
          </filter>
          <radialGradient id={`${variant}Grad1`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isDarkMode ? "#ffffff" : "#000000"} stopOpacity="1" />
            <stop offset="100%" stopColor={isDarkMode ? "#ffffff" : "#000000"} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${variant}Grad2`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isDarkMode ? "#f0f0f0" : "#0a0a0a"} stopOpacity="0.9" />
            <stop offset="100%" stopColor={isDarkMode ? "#ffffff" : "#000000"} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${variant}Grad3`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isDarkMode ? "#e0e0e0" : "#1a1a1a"} stopOpacity="0.8" />
            <stop offset="100%" stopColor={isDarkMode ? "#ffffff" : "#000000"} stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {blobs.blobs.map((blob, index) => (
          <ellipse
            key={index}
            cx={blob.cx}
            cy={blob.cy}
            rx={blob.rx}
            ry={blob.ry}
            fill={`url(#${variant}Grad${blob.grad})`}
            filter={`url(#${variant}Blur${blob.blur})`}
            opacity={blob.opacity || 1}
          />
        ))}
      </svg>
      
      {/* Additional CSS gradient overlay for depth */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: isDarkMode 
            ? 'radial-gradient(ellipse 70% 40% at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(ellipse 50% 35% at 70% 70%, rgba(255,255,255,0.06) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 70% 40% at 30% 30%, rgba(0,0,0,0.08) 0%, transparent 50%), radial-gradient(ellipse 50% 35% at 70% 70%, rgba(0,0,0,0.06) 0%, transparent 50%)'
        }}
      />
    </>
  )
}
