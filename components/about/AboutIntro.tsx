'use client'
import { Fragment, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import projectsData from '@/data/projects.json'
import { LAYERS, LayerId, techIn } from '@/lib/expertise'
import { openProject } from '@/lib/commandMenu'
import { getLenis } from '@/lib/lenis'

/**
 * The About paragraph: words light up as it scrolls through (scrubbed, no hijacking), and key
 * phrases are real buttons that open a small card with verified links: the matching stack
 * layers (lib/expertise.ts) and the projects that really use it (data/projects.json).
 */

type Lang = 'en' | 'fr' | 'ar'
type Project = { id: string; name: string; hidden?: boolean; stack?: string[]; description: Record<Lang, string> }
const projects = (projectsData.data as Project[]).filter((p) => !p.hidden)
const usesTech = (re: RegExp) => projects.filter((p) => p.stack?.some((s) => re.test(s))).map((p) => p.id)

type Term = { key: string; patterns: string[]; group?: LayerId[]; projects: string[] }
// phrases as they appear in each translation of the paragraph
const TERMS: Term[] = [
    { key: 'java', patterns: ['Java & Spring Boot', 'Java و Spring Boot'], group: ['api', 'services'], projects: usesTech(/^java$/i) },
    { key: 'carrefour', patterns: ['Carrefour'], projects: ['carrefour'] },
    { key: 'chanel', patterns: ['Chanel'], projects: ['chanel'] },
    { key: 'react', patterns: ['React'], group: ['ui'], projects: usesTech(/^react/i) },
    { key: 'angular', patterns: ['Angular'], group: ['ui'], projects: usesTech(/^angular/i) },
    { key: 'vue', patterns: ['Vue'], group: ['ui'], projects: usesTech(/^vue/i) },
    { key: 'ai', patterns: ['AI-powered products', "produits propulsés par l'IA", 'منتجات مدعومة بالذكاء الاصطناعي'], projects: usesTech(/^ai$/i) },
]
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const TERM_RE = new RegExp(
    `(${TERMS.flatMap((t) => t.patterns)
        .sort((a, b) => b.length - a.length)
        .map((p) => `(?<![\\p{L}\\d])${escape(p)}(?![\\p{L}\\d])`)
        .join('|')})`,
    'u'
)
const termFor = (text: string) => TERMS.find((t) => t.patterns.includes(text))!

type Labels = { open: string; expertise: string; usedIn: string; close: string }

export default function AboutIntro({ html, lang, t, labels }: { html: string; lang: Lang; t: (k: string) => string; labels: Labels }) {
    const root = useRef<HTMLParagraphElement>(null)
    const [open, setOpen] = useState<string | null>(null)
    const fine = useRef(false)
    const focusedAt = useRef(0) // focus opens the card; the click that caused the focus must not close it
    useEffect(() => {
        fine.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    }, [])

    // scroll-linked highlight: words go from dim to full as the paragraph scrolls through
    useEffect(() => {
        const el = root.current
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
            gsap.fromTo(
                el.querySelectorAll('.w'),
                { opacity: 0.22 },
                { opacity: 1, ease: 'none', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.6 } }
            )
        }, el)
        return () => ctx.revert()
    }, [html])

    // close on outside tap / Escape
    useEffect(() => {
        if (!open) return
        const onDown = (e: PointerEvent) => {
            if (!(e.target as HTMLElement).closest?.(`[data-term="${open}"]`)) setOpen(null)
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            root.current?.querySelector<HTMLButtonElement>(`[data-term="${open}"] > button`)?.focus()
            setOpen(null)
        }
        document.addEventListener('pointerdown', onDown)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onDown)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    // keep the open card inside the viewport
    useLayoutEffect(() => {
        const card = open ? root.current?.querySelector<HTMLElement>(`[data-term="${open}"] .term-card`) : null
        if (!card) return
        card.style.setProperty('--shift', '0px')
        const r = card.getBoundingClientRect()
        const pad = 16
        const shift = r.right > window.innerWidth - pad ? window.innerWidth - pad - r.right : r.left < pad ? pad - r.left : 0
        card.style.setProperty('--shift', `${Math.round(shift)}px`)
    }, [open])

    const words = (text: string, key: string) =>
        text.split(/(\s+)/).map((w, i) => (/^\s+$/.test(w) || !w ? w : <span className="w" key={`${key}-${i}`}>{w}</span>))

    const goTo = (id: string) => {
        setOpen(null)
        const el = document.getElementById(id)
        if (!el) return
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(el, { offset: -90 })
        else el.scrollIntoView({ behavior: 'smooth' })
    }

    const renderTerm = (text: string, key: string) => {
        const term = termFor(text)
        const id = `${term.key}-${key}`
        const isOpen = open === id
        const linked = term.projects.map((pid) => projects.find((p) => p.id === pid)!).filter(Boolean)
        const single = term.group === undefined && linked.length === 1 ? linked[0] : null
        return (
            <span className={`term${isOpen ? ' is-open' : ''}`} data-term={id} key={key}
                onMouseEnter={() => fine.current && setOpen(id)}
                onMouseLeave={() => fine.current && setOpen((o) => (o === id ? null : o))}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen((o) => (o === id ? null : o))
                }}
            >
                <button type="button" className="term-btn w" aria-expanded={isOpen} aria-controls={`card-${id}`} onFocus={() => {
                        focusedAt.current = performance.now()
                        setOpen(id)
                    }}
                    onClick={() => setOpen((o) => (o === id && performance.now() - focusedAt.current > 400 ? null : id))}>
                    {text}
                </button>
                <span className="term-card" id={`card-${id}`} role="group" aria-label={text} hidden={!isOpen}>
                    {single ? (
                        <>
                            <span className="tc-title">{single.name}</span>
                            <span className="tc-text">{single.description[lang] || single.description.en}</span>
                            {single.stack && <span className="tc-meta">{single.stack.join(' · ')}</span>}
                        </>
                    ) : (
                        <>
                            {term.group !== undefined && (
                                <>
                                    <span className="tc-title">{term.group.map((g) => LAYERS.find((l) => l.id === g)!.name).join(' · ')}</span>
                                    <span className="tc-meta">{term.group.flatMap((g) => techIn(g).map((x) => x.name)).join(' · ')}</span>
                                </>
                            )}
                            {linked.length > 0 && (
                                <span className="tc-text">
                                    {labels.usedIn}: {linked.map((p) => p.name).join(', ')}
                                </span>
                            )}
                        </>
                    )}
                    <span className="tc-actions">
                        {linked.slice(0, 3).map((p) => (
                            <button type="button" key={p.id} onClick={() => { setOpen(null); openProject(p.id) }}>
                                {single ? labels.open : p.name} ↗
                            </button>
                        ))}
                        {term.group !== undefined && (
                            <a href="#skills" onClick={(e) => { e.preventDefault(); goTo('skills') }}>
                                {labels.expertise} ↓
                            </a>
                        )}
                    </span>
                </span>
            </span>
        )
    }

    // the translated paragraph has <span class="…"> wrappers; split them, then the terms, then words
    const nodes: ReactNode[] = []
    const SPAN = /<span class="([^"]+)">([\s\S]*?)<\/span>/g
    let last = 0
    let m: RegExpExecArray | null
    const pushText = (text: string, cls: string | null, key: string) => {
        const parts = text.split(TERM_RE).filter((p) => p !== undefined && p !== '')
        const inner = parts.map((p, i) => (TERM_RE.test(p) && termFor(p) ? renderTerm(p, `${key}-${i}`) : <Fragment key={`${key}-${i}`}>{words(p, `${key}-${i}`)}</Fragment>))
        nodes.push(cls ? <span className={cls} key={key}>{inner}</span> : <Fragment key={key}>{inner}</Fragment>)
    }
    let n = 0
    while ((m = SPAN.exec(html))) {
        if (m.index > last) pushText(html.slice(last, m.index), null, `s${n++}`)
        pushText(m[2], m[1], `s${n++}`)
        last = m.index + m[0].length
    }
    if (last < html.length) pushText(html.slice(last), null, `s${n++}`)

    return (
        <p className="about__intro" ref={root}>
            {nodes}
        </p>
    )
}
