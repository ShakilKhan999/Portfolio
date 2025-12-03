import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAppSelector } from '../hooks/useAppSelector'

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 30

    // Determine colors based on dark mode
    const primaryColor = isDarkMode ? 0xffffff : 0x000000
    const secondaryColor = isDarkMode ? 0xf0f0f0 : 0x1a1a1a
    const tertiaryColor = isDarkMode ? 0xe0e0e0 : 0x333333
    const quaternaryColor = isDarkMode ? 0xd0d0d0 : 0x4d4d4d

    // Create floating geometric shapes
    const shapes: THREE.Mesh[] = []

    // Floating Cube
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: secondaryColor,
      metalness: 0.3,
      roughness: 0.4,
      wireframe: false,
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.position.set(-12, 8, -5)
    scene.add(cube)
    shapes.push(cube)

    // Floating Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(3, 0)
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: secondaryColor,
      emissive: tertiaryColor,
      metalness: 0.2,
      roughness: 0.5,
      wireframe: false,
    })
    const ico = new THREE.Mesh(icoGeometry, icoMaterial)
    ico.position.set(12, -6, -8)
    scene.add(ico)
    shapes.push(ico)

    // Floating Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(3, 0)
    const octaMaterial = new THREE.MeshStandardMaterial({
      color: tertiaryColor,
      emissive: quaternaryColor,
      metalness: 0.25,
      roughness: 0.45,
      wireframe: false,
    })
    const octa = new THREE.Mesh(octaGeometry, octaMaterial)
    octa.position.set(0, 12, -10)
    scene.add(octa)
    shapes.push(octa)

    // Floating Torus
    const torusGeometry = new THREE.TorusGeometry(3, 1, 16, 100)
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: quaternaryColor,
      emissive: tertiaryColor,
      metalness: 0.35,
      roughness: 0.35,
      wireframe: false,
    })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    torus.position.set(-10, -8, -5)
    scene.add(torus)
    shapes.push(torus)

    // Wireframe connecting lines
    const wireframeGeometry = new THREE.BufferGeometry()
    const wireframePositions = new Float32Array([
      -12, 8, -5,  12, -6, -8,
      12, -6, -8,  0, 12, -10,
      0, 12, -10,  -10, -8, -5,
      -10, -8, -5, -12, 8, -5,
    ])
    wireframeGeometry.setAttribute('position', new THREE.BufferAttribute(wireframePositions, 3))
    const wireframeColor = isDarkMode ? 0x888888 : 0x666666
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: wireframeColor, linewidth: 1, transparent: true, opacity: 0.3 })
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    scene.add(wireframe)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 100)
    pointLight1.position.set(20, 20, 20)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xcccccc, 1.2, 100)
    pointLight2.position.set(-20, -10, 20)
    scene.add(pointLight2)

    // Mouse tracking
    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', onMouseMove)

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Rotate shapes
      cube.rotation.x += 0.003
      cube.rotation.y += 0.004
      
      ico.rotation.x += 0.002
      ico.rotation.z += 0.005
      
      octa.rotation.y += 0.003
      octa.rotation.z += 0.002
      
      torus.rotation.x += 0.004
      torus.rotation.y += 0.002

      // Subtle floating animation based on mouse
      shapes.forEach((shape, index) => {
        const originalY = shape.position.y
        shape.position.y = originalY + Math.sin(Date.now() * 0.0005 + index) * 0.5 + mouseY * 2
        shape.position.x += (mouseX * 0.5 - shape.position.x) * 0.02
      })

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

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [isDarkMode])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  )
}
