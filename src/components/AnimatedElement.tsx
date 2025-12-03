import React, { useEffect, useRef, useState } from 'react'

interface AnimatedElementProps {
  children: React.ReactNode
  animation: 'fadeIn' | 'slideUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn'
  delay?: number
}

export default function AnimatedElement({ 
  children, 
  animation, 
  delay = 0 
}: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay before triggering animation
          setTimeout(() => {
            setIsVisible(true)
          }, delay * 1000)
          // Don't unobserve - keep it visible
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={`animate-${animation} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        animation: isVisible ? `${animation} 0.6s ease-out forwards` : 'none',
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
