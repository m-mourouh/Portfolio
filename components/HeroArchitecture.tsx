'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { heroAnchor } from '@/lib/heroAnchor'
import { heroStack, onRunRequest, heroIntro, emitPulse } from '@/lib/heroStack'

/**
 * "A request through the system": the hero signature.
 * Five plates = the layers I work on (bottom → top: AI, DATA, SERVICES, API, UI), wired with
 * circuit traces and vias. A lime pulse enters at UI and travels down layer by layer; each
 * plate lights up when reached. Hover / focus highlights a layer and dims the others; click
 * a plate to send a new request. Scrolling separates the layers. Labels are HTML (HeroLayers).
 */

type Shared = { uTime: { value: number }; uMouse: { value: THREE.Vector2 } }
export type StackPointer = { ndc: THREE.Vector2; inside: boolean; tapNdc: THREE.Vector2 | null }

// bottom → top: the foundation is widest
const PLATES = [
    { w: 3.5, d: 2.5 },
    { w: 3.15, d: 2.25 },
    { w: 2.8, d: 2.0 },
    { w: 2.45, d: 1.75 },
    { w: 2.1, d: 1.5 },
]
const COUNT = PLATES.length
const TOP = COUNT - 1
const THICK = 0.05
const GAP = 0.42
const SURFACE = THICK / 2 + 0.004
const STEP_TIME = 0.45 // seconds the pulse takes from one layer to the next

function seeded(seed: number) {
    let a = seed
    return () => {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function build() {
    const rnd = seeded(20261108)
    const withLayer = (g: THREE.BufferGeometry, i: number) => {
        g.setAttribute('aLayer', new THREE.Float32BufferAttribute(new Array(g.attributes.position.count).fill(i), 1))
        return g
    }
    const plates = mergeGeometries(PLATES.map((p, i) => withLayer(new THREE.BoxGeometry(p.w, THICK, p.d), i)))!
    const edges = mergeGeometries(PLATES.map((p, i) => withLayer(new THREE.EdgesGeometry(new THREE.BoxGeometry(p.w, THICK, p.d)), i)))!

    type Node = { x: number; z: number; layer: number }
    const nodes: Node[] = []
    PLATES.forEach((p, layer) => {
        nodes.push({ x: 0, z: 0, layer }) // the request's path runs through the center of every layer
        const count = 4 - Math.floor(layer / 2)
        for (let k = 0; k < count; k++) {
            const x = Math.round(((rnd() - 0.5) * (p.w - 0.5)) / 0.25) * 0.25
            const z = Math.round(((rnd() - 0.5) * (p.d - 0.45)) / 0.25) * 0.25
            if (!nodes.some((n) => n.layer === layer && n.x === x && n.z === z)) nodes.push({ x, z, layer })
        }
    })

    // traces (L-shaped) on each layer; vias between layers (incl. the central request path)
    const seg: Array<{ a: THREE.Vector3; b: THREE.Vector3; la: number; lb: number; kind: number }> = []
    PLATES.forEach((_, layer) => {
        const own = nodes.filter((n) => n.layer === layer)
        for (let k = 0; k < own.length - 1; k++) {
            const a = own[k]
            const b = own[k + 1]
            const corner = new THREE.Vector3(b.x, SURFACE, a.z)
            seg.push({ a: new THREE.Vector3(a.x, SURFACE, a.z), b: corner, la: layer, lb: layer, kind: 0 })
            seg.push({ a: corner, b: new THREE.Vector3(b.x, SURFACE, b.z), la: layer, lb: layer, kind: 0 })
        }
    })
    for (let layer = 0; layer < TOP; layer++) {
        // the via's top end sits on the upper layer (its y is offset by the layer height in the shader)
        seg.push({ a: new THREE.Vector3(0, SURFACE, 0), b: new THREE.Vector3(0, -SURFACE, 0), la: layer, lb: layer + 1, kind: 1 })
        const lower = nodes.filter((n) => n.layer === layer && (n.x !== 0 || n.z !== 0))
        const upper = nodes.filter((n) => n.layer === layer + 1 && (n.x !== 0 || n.z !== 0))
        const pair = lower.flatMap((a) => upper.map((b) => ({ a, b, d: Math.hypot(a.x - b.x, a.z - b.z) }))).sort((p, q) => p.d - q.d)[0]
        if (pair) seg.push({ a: new THREE.Vector3(pair.a.x, SURFACE, pair.a.z), b: new THREE.Vector3(pair.b.x, -SURFACE, pair.b.z), la: layer, lb: layer + 1, kind: 1 })
    }
    const lines = new THREE.BufferGeometry()
    lines.setAttribute('position', new THREE.Float32BufferAttribute(seg.flatMap((s) => [s.a.x, s.a.y, s.a.z, s.b.x, s.b.y, s.b.z]), 3))
    lines.setAttribute('aLayer', new THREE.Float32BufferAttribute(seg.flatMap((s) => [s.la, s.lb]), 1))
    lines.setAttribute('aKind', new THREE.Float32BufferAttribute(seg.flatMap((s) => [s.kind, s.kind]), 1))

    const points = new THREE.BufferGeometry()
    points.setAttribute('position', new THREE.Float32BufferAttribute(nodes.flatMap((n) => [n.x, SURFACE, n.z]), 3))
    points.setAttribute('aLayer', new THREE.Float32BufferAttribute(nodes.map((n) => n.layer), 1))

    // the request pulse: a single glowing point, moved along the central path every frame
    const pulse = new THREE.BufferGeometry()
    pulse.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3))

    // node on the top layer closest to the headline: the dotted link to the text starts here
    const top = nodes.filter((n) => n.layer === TOP)
    const connector = [...top].sort((a, b) => a.x + a.z * 0.3 - (b.x + b.z * 0.3))[0]
    const connectorRtl = [...top].sort((a, b) => b.x - b.z * 0.3 - (a.x - a.z * 0.3))[0]
    return { plates, edges, lines, points, pulse, connector, connectorRtl }
}

// shared GLSL: layer height (+ scroll spread), build-in, request light and focus dimming
const chunk = /* glsl */ `
    uniform float uBuild;
    uniform float uSpread;
    uniform float uFocus;
    uniform float uLit[${COUNT}];
    float layerBuild(float layer) { return smoothstep(layer * 0.15, layer * 0.15 + 0.3, uBuild); }
    vec3 placeOnLayer(vec3 p, float layer) {
        p.y += layer * (${GAP.toFixed(2)} + uSpread) - (1.0 - layerBuild(layer)) * 0.5;
        return p;
    }
    float litOf(float layer) {
        float v = 0.0;
        for (int i = 0; i < ${COUNT}; i++) { if (abs(layer - float(i)) < 0.5) v = uLit[i]; }
        return v;
    }
    // 1 = the focused layer, -1 = another layer while one is focused, 0 = nothing focused
    float focusOf(float layer) { return uFocus < -0.5 ? 0.0 : (abs(layer - uFocus) < 0.5 ? 1.0 : -1.0); }
`

const plateVert = /* glsl */ `
    ${chunk}
    attribute float aLayer;
    varying vec3 vN; varying vec3 vView; varying vec3 vLocal;
    varying float vBuild; varying float vAct; varying float vDim; varying float vTop;
    void main() {
        vec3 p = placeOnLayer(position, aLayer);
        vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
        vN = normalize(normalMatrix * normal); vView = normalize(-mv.xyz); vLocal = position;
        float f = focusOf(aLayer);
        vBuild = layerBuild(aLayer); vAct = max(litOf(aLayer), max(f, 0.0)); vDim = f < -0.5 ? 0.35 : 1.0;
        vTop = step(0.5, normal.y);
        gl_Position = projectionMatrix * mv;
    }
`
const plateFrag = /* glsl */ `
    varying vec3 vN; varying vec3 vView; varying vec3 vLocal;
    varying float vBuild; varying float vAct; varying float vDim; varying float vTop;
    void main() {
        vec3 lime = vec3(0.77, 1.0, 0.0);
        float rim = pow(1.0 - abs(dot(vN, vView)), 6.0);
        vec3 col = vec3(0.062) + lime * rim * 0.12 * (1.0 - vTop) + vec3(0.02) * vTop;
        vec2 g = vLocal.xz / 0.25;
        vec2 gr = abs(fract(g - 0.5) - 0.5) / fwidth(g);
        float line = (1.0 - min(min(gr.x, gr.y), 1.0)) * vTop;
        col += vec3(1.0) * line * 0.045 + lime * line * vAct * 0.28 + lime * vTop * vAct * 0.035;
        gl_FragColor = vec4(col, 0.88 * vBuild * vDim);
    }
`
const edgeVert = /* glsl */ `
    ${chunk}
    attribute float aLayer;
    varying float vAlpha; varying float vAct;
    void main() {
        vec3 p = placeOnLayer(position, aLayer);
        float f = focusOf(aLayer);
        vAct = max(litOf(aLayer), max(f, 0.0));
        vAlpha = layerBuild(aLayer) * (f < -0.5 ? 0.3 : 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0);
    }
`
const edgeFrag = /* glsl */ `
    varying float vAlpha; varying float vAct;
    void main() {
        vec3 col = mix(vec3(0.85), vec3(0.77, 1.0, 0.0), clamp(vAct * 1.5, 0.0, 1.0));
        gl_FragColor = vec4(col, vAlpha * (0.42 + vAct * 0.58));
    }
`
const traceVert = /* glsl */ `
    ${chunk}
    attribute float aLayer; attribute float aKind;
    varying float vAlpha; varying float vKind; varying float vAct;
    void main() {
        vec3 p = placeOnLayer(position, aLayer);
        vKind = aKind;
        float f = focusOf(aLayer);
        vAct = max(litOf(aLayer), max(f, 0.0));
        vAlpha = layerBuild(aLayer) * smoothstep(0.55, 0.9, uBuild) * (f < -0.5 ? 0.3 : 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0);
    }
`
const traceFrag = /* glsl */ `
    varying float vAlpha; varying float vKind; varying float vAct;
    void main() {
        vec3 col = mix(vec3(0.75), vec3(0.77, 1.0, 0.0), clamp(vKind * 0.6 + vAct, 0.0, 1.0));
        gl_FragColor = vec4(col, vAlpha * (vKind > 0.5 ? 0.55 : 0.3 + vAct * 0.4));
    }
`
const nodeVert = /* glsl */ `
    ${chunk}
    uniform float uPixelRatio;
    attribute float aLayer;
    varying float vAlpha; varying float vAct;
    void main() {
        vec3 p = placeOnLayer(position, aLayer);
        vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
        float f = focusOf(aLayer);
        vAct = max(litOf(aLayer), max(f, 0.0));
        vAlpha = layerBuild(aLayer) * smoothstep(0.5, 0.8, uBuild) * (f < -0.5 ? 0.3 : 1.0);
        gl_PointSize = (7.0 + vAct * 4.0) * uPixelRatio * (6.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
    }
`
const nodeFrag = /* glsl */ `
    varying float vAlpha; varying float vAct;
    void main() {
        vec2 c = abs(gl_PointCoord - 0.5);
        float d = max(c.x, c.y);
        float a = max(step(0.36, d) * 0.8, 1.0 - step(0.16, d));
        if (a < 0.01) discard;
        gl_FragColor = vec4(mix(vec3(0.95), vec3(0.77, 1.0, 0.0), clamp(0.3 + vAct, 0.0, 1.0)), a * vAlpha);
    }
`
const pulseVert = /* glsl */ `
    uniform float uPixelRatio; uniform float uPulse;
    void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 26.0 * uPixelRatio * (6.0 / -mv.z) * uPulse;
        gl_Position = projectionMatrix * mv;
    }
`
const pulseFrag = /* glsl */ `
    uniform float uPulse;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(0.85, 1.0, 0.25, core * core * uPulse);
    }
`

export default function HeroArchitecture({
    shared,
    pointer,
    scroll,
    buildDelay,
    reducedMotion,
}: {
    shared: Shared
    pointer: React.MutableRefObject<StackPointer>
    scroll: React.MutableRefObject<number>
    buildDelay: number
    reducedMotion: boolean
}) {
    const stack = useRef<THREE.Group>(null)
    const geo = useMemo(build, [])
    const uniforms = useMemo(
        () => ({
            uBuild: { value: reducedMotion ? 1 : 0 },
            uSpread: { value: 0 },
            uFocus: { value: -1 },
            uLit: { value: new Array(COUNT).fill(0) as number[] },
            uPulse: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
        }),
        [reducedMotion]
    )
    void shared

    useEffect(() => () => [geo.plates, geo.edges, geo.lines, geo.points, geo.pulse].forEach((g) => g.dispose()), [geo])

    // right-to-left pages (Arabic): the headline is on the right, so the stack mirrors to the left
    const [rtl, setRtl] = useState(() => document.documentElement.dir === 'rtl')
    useEffect(() => {
        const mo = new MutationObserver(() => setRtl(document.documentElement.dir === 'rtl'))
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] })
        return () => mo.disconnect()
    }, [])
    heroStack.rtl = rtl

    // Auto-fit: the stack fills the right half (left half in RTL), vertically centered, its top plate reaching
    // behind the headline; solved from the resting camera so every screen shape works
    const { size, camera } = useThree()
    const base = useMemo(() => {
        const aspect = size.width / Math.max(1, size.height)
        const cam = new THREE.PerspectiveCamera(50, aspect, 0.1, 100)
        cam.position.set(0, 2.4, 6)
        cam.lookAt(0, 0, -4)
        cam.updateMatrixWorld()
        cam.updateProjectionMatrix()
        const ndcX = (aspect > 1.6 ? 0.3 : aspect > 1.25 ? 0.34 : 0.46) * (rtl ? -1 : 1)
        const frac = aspect > 1.25 ? 0.8 : 0.58 // ~1.4x the V5 size
        const radius = 2.6
        const dir = new THREE.Vector3(ndcX, 0, 0.5).unproject(cam).sub(cam.position).normalize()
        const d = radius / (frac * Math.tan(THREE.MathUtils.degToRad(25)))
        const center = cam.position.clone().add(dir.multiplyScalar(d))
        center.y -= GAP * 2
        return center
    }, [size.width, size.height, rtl])

    // own clock: keeps running under reduced motion (the shared uTime is frozen there)
    const clock = useRef(0)
    const buildStart = useRef(-1)
    const lastReached = useRef(-1)
    void buildDelay
    const request = useRef({ start: -1, auto: false })
    useEffect(() => onRunRequest(() => (request.current.start = clock.current)), [])

    const tmp = useMemo(() => new THREE.Vector3(), [])
    const ray = useMemo(() => new THREE.Raycaster(), [])
    const inv = useMemo(() => new THREE.Matrix4(), [])
    const tilt = useRef({ x: 0, y: 0 })

    useEffect(
        () => () => {
            heroAnchor.visible = false
            heroStack.visible = false
            heroStack.step = -1
            heroStack.focus = -1
        },
        []
    )

    // which plate is under a screen point (ray tested against each plate's top, top-most first)
    const pick = (ndc: THREE.Vector2, g: THREE.Group): number => {
        ray.setFromCamera(ndc, camera)
        inv.copy(g.matrixWorld).invert()
        const o = ray.ray.origin.clone().applyMatrix4(inv)
        const dv = ray.ray.direction.clone().transformDirection(inv)
        if (Math.abs(dv.y) < 1e-4) return -1
        for (let i = TOP; i >= 0; i--) {
            const t = (i * (GAP + uniforms.uSpread.value) + SURFACE - o.y) / dv.y
            if (t <= 0) continue
            if (Math.abs(o.x + dv.x * t) <= PLATES[i].w / 2 && Math.abs(o.z + dv.z * t) <= PLATES[i].d / 2) return i
        }
        return -1
    }

    useFrame((_, delta) => {
        const dt = Math.min(delta, 1 / 30)
        const t = (clock.current += dt)
        const u = uniforms
        // the stack builds when the hero timeline reaches it (failsafe: after 5 s anyway)
        if (u.uBuild.value < 1 && (heroIntro.stack || t > 5)) {
            if (buildStart.current < 0) buildStart.current = t
            u.uBuild.value = reducedMotion ? 1 : Math.min(1, (t - buildStart.current) / 1.2)
        }
        // the first request runs once the stack has built, i.e. after the headline reveal
        if (!request.current.auto && u.uBuild.value >= 1) {
            request.current.auto = true
            request.current.start = t + 0.25
        }

        // scroll handoff: the layers separate (progress comes from a ScrollTrigger)
        const s = scroll.current
        const eased = 1 - Math.pow(1 - Math.min(1, s * 1.6), 3)
        u.uSpread.value = eased * 0.6
        heroStack.explode = eased

        const g = stack.current
        if (!g) return
        const p = pointer.current
        const k = 1 - Math.pow(0.04, dt)
        const still = reducedMotion
        tilt.current.y += ((p.inside && !still ? p.ndc.x * 0.12 : 0) - tilt.current.y) * k
        tilt.current.x += ((p.inside && !still ? -p.ndc.y * 0.05 : 0) - tilt.current.x) * k
        g.rotation.y = -0.55 + (still ? 0 : Math.sin(t * 0.16) * 0.03) + tilt.current.y + eased * 0.35
        g.rotation.x = 0.1 + tilt.current.x
        g.position.set(base.x, base.y + (still ? 0 : Math.sin(t * 0.5) * 0.03) - s * 0.9, base.z)
        g.updateMatrixWorld()

        // hover picks a plate (a keyboard-focused label wins); a click on a plate sends a request
        if (!heroStack.keyFocus) heroStack.focus = p.inside && u.uBuild.value >= 1 && s < 0.3 ? pick(p.ndc, g) : -1
        if (p.tapNdc) {
            if (pick(p.tapNdc, g) >= 0) request.current.start = t
            p.tapNdc = null
        }
        u.uFocus.value = heroStack.focus

        // the request: enters above UI, then travels down through every layer to AI
        const lit = u.uLit.value
        const r = request.current.start
        const layerY = (i: number) => i * (GAP + u.uSpread.value) + SURFACE
        if (r >= 0 && t >= r) {
            const el = t - r
            if (still) {
                // no motion: every layer highlights at once, then fades
                for (let i = 0; i < COUNT; i++) lit[i] = el < 1.4 ? 1 : Math.max(0, 1 - (el - 1.4) / 0.5)
                heroStack.step = el < 1.9 ? 0 : -1
                u.uPulse.value = 0
                if (el > 2) request.current.start = -1
            } else {
                const travel = el / STEP_TIME // 0 = above UI, 1 = UI reached, … 5 = AI reached
                for (let i = 0; i < COUNT; i++) {
                    const since = travel - (TOP - i + 1)
                    lit[i] = since < 0 ? 0 : Math.max(0, 1 - since / 3)
                }
                const reached = Math.min(COUNT, Math.floor(travel))
                heroStack.step = reached >= 1 && travel < COUNT + 3.5 ? COUNT - reached : -1
                if (reached >= 1 && reached <= COUNT && reached !== lastReached.current) emitPulse(reached - 1)
                lastReached.current = travel < COUNT + 3.5 ? reached : -1
                const y0 = layerY(TOP) + 0.9
                const at = (n: number) => (n <= 0 ? y0 : layerY(COUNT - n))
                const n = Math.min(travel, COUNT)
                const from = Math.floor(n)
                const y = from >= COUNT ? at(COUNT) : at(from) + (at(from + 1) - at(from)) * (n - from)
                const pos = geo.pulse.getAttribute('position') as THREE.BufferAttribute
                pos.setXYZ(0, 0, y, 0)
                pos.needsUpdate = true
                u.uPulse.value = travel < COUNT ? Math.min(1, travel * 3) : Math.max(0, 1 - (travel - COUNT) * 2)
                if (travel > COUNT + 3.5) request.current.start = -1
            }
        } else if (r < 0) {
            for (let i = 0; i < COUNT; i++) lit[i] *= 0.92
            u.uPulse.value = 0
            heroStack.step = -1
        }
        for (let i = 0; i < COUNT; i++) heroStack.lit[i] = lit[i]

        // screen anchors for the HTML labels (right corner of each plate) and the headline link
        for (let i = 0; i < COUNT; i++) {
            let best = rtl ? Infinity : -Infinity
            for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                tmp.set((sx * PLATES[i].w) / 2, layerY(i), (sz * PLATES[i].d) / 2)
                g.localToWorld(tmp).project(camera)
                const x = ((tmp.x + 1) / 2) * size.width
                if (rtl ? x < best : x > best) {
                    best = x
                    heroStack.anchors[i].x = x
                    heroStack.anchors[i].y = ((1 - tmp.y) / 2) * size.height
                }
            }
        }
        heroStack.visible = u.uBuild.value > 0.98
        const link = rtl ? geo.connectorRtl : geo.connector
        tmp.set(link.x, layerY(TOP), link.z)
        g.localToWorld(tmp).project(camera)
        heroAnchor.x = ((tmp.x + 1) / 2) * size.width
        heroAnchor.y = ((1 - tmp.y) / 2) * size.height
        heroAnchor.visible = u.uBuild.value > 0.98 && s < 0.5
    })

    return (
        <group ref={stack} position={[base.x, base.y, base.z]}>
            <mesh geometry={geo.plates} frustumCulled={false} renderOrder={1}>
                <shaderMaterial vertexShader={plateVert} fragmentShader={plateFrag} uniforms={uniforms} transparent depthWrite />
            </mesh>
            <lineSegments geometry={geo.edges} frustumCulled={false} renderOrder={2}>
                <shaderMaterial vertexShader={edgeVert} fragmentShader={edgeFrag} uniforms={uniforms} transparent depthWrite={false} />
            </lineSegments>
            <lineSegments geometry={geo.lines} frustumCulled={false} renderOrder={2}>
                <shaderMaterial vertexShader={traceVert} fragmentShader={traceFrag} uniforms={uniforms} transparent depthWrite={false} />
            </lineSegments>
            <points geometry={geo.points} frustumCulled={false} renderOrder={3}>
                <shaderMaterial vertexShader={nodeVert} fragmentShader={nodeFrag} uniforms={uniforms} transparent depthWrite={false} />
            </points>
            <points geometry={geo.pulse} frustumCulled={false} renderOrder={4}>
                <shaderMaterial
                    vertexShader={pulseVert}
                    fragmentShader={pulseFrag}
                    uniforms={uniforms}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    )
}
