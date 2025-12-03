import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useAppSelector } from './hooks/useAppSelector'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import CaseStudies from './components/CaseStudies'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminDashboard from './components/AdminDashboard'
import ParticleField from './components/ParticleField'
import { useFirestoreSync } from './hooks/useFirestoreSync'
import { RootState } from './store'

export default function App() {
  const isDarkMode = useAppSelector((state: RootState) => state.ui.isDarkMode)
  const [showAdmin, setShowAdmin] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useFirestoreSync()

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  useEffect(() => {
    const handleSecretShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault()
        setShowAdmin(true)
      }
    }

    window.addEventListener('keydown', handleSecretShortcut)
    return () => window.removeEventListener('keydown', handleSecretShortcut)
  }, [])

  // Three.js Background Animation
  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.position.z = 3

    // Create animated icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.2, 1)
    const material = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x404040 : 0xcccccc,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1)
    light.position.set(5, 5, 5)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    // Mouse tracking
    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', onMouseMove)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate mesh based on mouse position
      mesh.rotation.x += 0.0005 + mouseY * 0.001
      mesh.rotation.y += 0.0008 + mouseX * 0.001

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [isDarkMode])

  if (showAdmin) {
    return <AdminDashboard onClose={() => setShowAdmin(false)} />
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Particle Animation Background */}
      <ParticleField />

      {/* Navigation */}
      <Navigation onAdminAccess={() => setShowAdmin(true)} />

      {/* Main Content */}
      <main>
        <Hero />
        <Skills />
        <Projects />
        <CaseStudies />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
