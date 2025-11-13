'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GalaxyEffect = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!mountRef.current) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        const renderer = new THREE.WebGLRenderer({ alpha: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        mountRef.current.appendChild(renderer.domElement)

        const starsGeometry = new THREE.BufferGeometry()
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 })

        const starVertices = []
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000
            const y = (Math.random() - 0.5) * 2000
            const z = (Math.random() - 0.5) * 2000
            starVertices.push(x, y, z)
        }

        starsGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starVertices, 3)
        )

        const stars = new THREE.Points(starsGeometry, starsMaterial)
        // scene.add(stars)

        // Shooting star logic
        const shootingStarGeometry = new THREE.SphereGeometry(0.2)
        const shootingStarMaterial = new THREE.MeshBasicMaterial({ color: 0xF8D628 })
        const shootingStars: THREE.Mesh[] = []

        for (let i = 0; i < 5; i++) { // Create 5 shooting stars
            const star = new THREE.Mesh(shootingStarGeometry, shootingStarMaterial)
            star.position.set(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                -100 - Math.random() * 100
            )
            // scene.add(star)
            // shootingStars.push(star)
        }

        const ambientLight = new THREE.AmbientLight(0x404040, 2)
        scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(1, 1, 1)
        scene.add(light)

        camera.position.z = 5

        const mouse = { x: 0, y: 0 }

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        window.addEventListener('mousemove', handleMouseMove)

        const animate = () => {
            requestAnimationFrame(animate)
            stars.rotation.x += 0.0005 + (mouse.y / 10 - stars.rotation.x) * 0.02
            stars.rotation.y += 0.0005 + (mouse.x / 10 - stars.rotation.y) * 0.02

            shootingStars.forEach(star => {
                star.position.z += 1 // Move towards camera
                if (star.position.z > 50) { // Reset if too close
                    star.position.set(
                        (Math.random() - 0.5) * 200,
                        (Math.random() - 0.5) * 200,
                        -100 - Math.random() * 100
                    )
                }
            })

            renderer.render(scene, camera)
        }

        animate()

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement)
            }
        }
    }, [])

    return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />
}

export default GalaxyEffect
