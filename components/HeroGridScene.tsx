'use client'
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Interactive 3D grid for the hero section.
 * - A dense plane displaced in the vertex shader (idle waves + cursor bump/ripple + click shockwave).
 * - Grid lines are drawn in the fragment shader so they stay crisp at any distance.
 * Pointer is tracked on window because the canvas sits behind the content (pointer-events: none).
 */

const ACCENT = '#c4ff00'
const BASE = '#ffffff'

const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uStrength;
    uniform vec2 uClick;
    uniform float uClickAge;

    varying vec2 vXZ;
    varying float vHeight;
    varying float vGlow;
    varying float vDepth;

    void main() {
        vec3 p = position;
        vec2 xz = p.xz;

        // Idle "breathing" terrain
        float h = sin(xz.x * 0.35 + uTime * 0.6) * 0.05
                + cos(xz.y * 0.30 + uTime * 0.45) * 0.05;

        // Cursor bump + ripple ring
        float d = distance(xz, uMouse);
        float bump = exp(-d * d * 1.2) * uStrength;
        float ring = sin(d * 4.0 - uTime * 5.0) * exp(-d * 1.2) * uStrength * 0.12;
        h += bump * 0.45 + ring;

        // Click shockwave travelling outwards
        float cd = distance(xz, uClick);
        float radius = uClickAge * 7.0;
        float wave = exp(-pow(cd - radius, 2.0) * 3.0) * exp(-uClickAge * 1.4) * 0.35;
        h += wave;

        p.y += h;

        vXZ = xz;
        vHeight = h;
        vGlow = clamp(exp(-d * d * 0.6) * (0.35 + uStrength) + wave * 1.5, 0.0, 1.0);

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
    }
`

const fragmentShader = /* glsl */ `
    uniform vec3 uBase;
    uniform vec3 uAccent;
    uniform float uCell;
    uniform float uFogNear;
    uniform float uFogFar;

    varying vec2 vXZ;
    varying float vHeight;
    varying float vGlow;
    varying float vDepth;

    void main() {
        vec2 g = vXZ / uCell;
        vec2 grid = abs(fract(g - 0.5) - 0.5) / fwidth(g);
        float line = 1.0 - min(min(grid.x, grid.y), 1.0);
        vec2 fw = fwidth(g);
        line *= 1.0 - smoothstep(0.25, 0.5, max(fw.x, fw.y));

        float fog = 1.0 - smoothstep(uFogNear, uFogFar, vDepth);
        vec3 color = mix(uBase, uAccent, vGlow);

        // Resting lines match the flat background grid (white @ ~5-6%)
        float alpha = line * fog * mix(0.06, 0.9, vGlow);
        alpha += line * fog * clamp(vHeight, 0.0, 1.0) * 0.4;

        // ~5% of cells faintly filled, like the flat background grid
        vec2 cellId = floor(g);
        float rnd = fract(sin(dot(cellId, vec2(127.1, 311.7))) * 43758.5453);
        alpha = max(alpha, step(0.95, rnd) * 0.02 * fog);

        if (alpha < 0.003) discard;
        gl_FragColor = vec4(color, alpha);
    }
`

type PointerState = {
    ndc: THREE.Vector2
    speed: number
    inside: boolean
    clickNdc: THREE.Vector2 | null
}

function GridPlane({
    pointer,
    segments,
    reducedMotion,
}: {
    pointer: React.MutableRefObject<PointerState>
    segments: number
    reducedMotion: boolean
}) {
    const { camera } = useThree()
    const material = useRef<THREE.ShaderMaterial>(null)

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(60, 60, segments, segments)
        geo.rotateX(-Math.PI / 2)
        return geo
    }, [segments])

    useEffect(() => () => geometry.dispose(), [geometry])

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 2) },
            uStrength: { value: 0.2 },
            uClick: { value: new THREE.Vector2(0, 0) },
            uClickAge: { value: 100 },
            uBase: { value: new THREE.Color(BASE) },
            uAccent: { value: new THREE.Color(ACCENT) },
            uCell: { value: 0.5 },
            uFogNear: { value: 3 },
            uFogFar: { value: 16 },
        }),
        []
    )

    const helpers = useMemo(
        () => ({
            raycaster: new THREE.Raycaster(),
            floor: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
            hit: new THREE.Vector3(),
            target: new THREE.Vector2(0, 2),
        }),
        []
    )

    const toFloor = (ndc: THREE.Vector2): THREE.Vector2 | null => {
        helpers.raycaster.setFromCamera(ndc, camera)
        const hit = helpers.raycaster.ray.intersectPlane(helpers.floor, helpers.hit)
        return hit ? new THREE.Vector2(hit.x, hit.z) : null
    }

    useFrame((_, delta) => {
        const u = uniforms
        const p = pointer.current
        const dt = Math.min(delta, 1 / 30)

        if (!reducedMotion) u.uTime.value += dt

        if (p.inside) {
            const hit = toFloor(p.ndc)
            if (hit) helpers.target.copy(hit)
        }
        u.uMouse.value.lerp(helpers.target, 1 - Math.pow(0.001, dt))

        // Faster pointer -> stronger bump, decays back to a resting level
        const goal = p.inside ? 0.3 + Math.min(p.speed * 4, 0.5) : 0.1
        u.uStrength.value += (goal - u.uStrength.value) * (1 - Math.pow(0.02, dt))
        p.speed *= Math.pow(0.05, dt)

        if (p.clickNdc) {
            const hit = toFloor(p.clickNdc)
            if (hit) {
                u.uClick.value.copy(hit)
                u.uClickAge.value = 0
            }
            p.clickNdc = null
        }
        u.uClickAge.value += dt

        // Gentle camera parallax following the pointer
        if (!reducedMotion) {
            camera.position.x += (p.ndc.x * 0.1 - camera.position.x) * (1 - Math.pow(0.05, dt))
            camera.position.y += (2.4 + p.ndc.y * 0.1 - camera.position.y) * (1 - Math.pow(0.05, dt))
            camera.lookAt(0, 0, -4)
        }
    })

    return (
        <mesh geometry={geometry} frustumCulled={false}>
            <shaderMaterial
                ref={material}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

export default function HeroGridScene() {
    const wrapper = useRef<HTMLDivElement>(null)
    const pointer = useRef<PointerState>({
        ndc: new THREE.Vector2(0, -0.3),
        speed: 0,
        inside: false,
        clickNdc: null,
    })

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    const reducedMotion =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const segments = isMobile ? 110 : 220

    // Track pointer relative to the canvas (canvas itself ignores pointer events)
    useEffect(() => {
        const el = wrapper.current
        if (!el) return
        let last = { x: 0, y: 0, t: performance.now() }

        const toNdc = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            return {
                x: ((e.clientX - r.left) / r.width) * 2 - 1,
                y: -((e.clientY - r.top) / r.height) * 2 + 1,
                inside:
                    e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom,
            }
        }

        const onMove = (e: PointerEvent) => {
            const n = toNdc(e)
            const now = performance.now()
            const dt = Math.max(now - last.t, 1) / 1000
            const dist = Math.hypot(n.x - last.x, n.y - last.y)
            pointer.current.speed = Math.max(pointer.current.speed, dist / dt / 10)
            pointer.current.ndc.set(n.x, n.y)
            pointer.current.inside = n.inside
            last = { x: n.x, y: n.y, t: now }
        }
        const onDown = (e: PointerEvent) => {
            const n = toNdc(e)
            if (n.inside) pointer.current.clickNdc = new THREE.Vector2(n.x, n.y)
        }
        const onLeave = () => {
            pointer.current.inside = false
        }

        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pointerdown', onDown, { passive: true })
        document.addEventListener('pointerleave', onLeave)
        return () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerdown', onDown)
            document.removeEventListener('pointerleave', onLeave)
        }
    }, [])

    // Pause rendering when the hero is scrolled out of view
    const canvasState = useRef<{ setFrameloop?: (v: 'always' | 'never' | 'demand') => void }>({})
    useEffect(() => {
        const el = wrapper.current
        if (!el) return
        const io = new IntersectionObserver(([entry]) => {
            canvasState.current.setFrameloop?.(
                entry.isIntersecting ? (reducedMotion ? 'demand' : 'always') : 'never'
            )
        })
        io.observe(el)
        return () => io.disconnect()
    }, [reducedMotion])

    return (
        <div ref={wrapper} style={{ position: 'absolute', inset: 0 }}>
            <Canvas
                dpr={[1, isMobile ? 1.25 : 1.5]}
                frameloop={reducedMotion ? 'demand' : 'always'}
                camera={{ position: [0, 2.4, 6], fov: 50, near: 0.1, far: 100 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                onCreated={(state) => {
                    state.camera.lookAt(0, 0, -4)
                    canvasState.current.setFrameloop = state.setFrameloop
                }}
                style={{ pointerEvents: 'none' }}
            >
                <GridPlane pointer={pointer} segments={segments} reducedMotion={reducedMotion} />
            </Canvas>
        </div>
    )
}
