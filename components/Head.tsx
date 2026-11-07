'use client'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi'
import { StyledSelection } from '@/styles/styled-components/Head.styled'
import ProfilePic from '@/public/images/mohamed_mourouh.jpeg'
import HeroGrid3D from './HeroGrid3D'
import HeroLayers from './HeroLayers'
import HeroStackSvg from './HeroStackSvg'
import { layerInfo } from '@/lib/heroLayers'
import { runRequest, startHero, onLoaderExit } from '@/lib/heroStack'
import HeroLink from './HeroLink'
import HeroHeadline, { headlineIntro } from './HeroHeadline'
import userData from '@/data/user.json'
import { useLanguage } from '@/contexts/LanguageContext'
import { openContactDrawer } from '@/lib/contactDrawer'
import { getLenis } from '@/lib/lenis'


/**
 * Hero: editorial headline over the "Systems in Motion" 3D scene.
 * The text is server-rendered and fully readable without JS / WebGL; the entrance only
 * slides words in from behind a mask (no long blank intro).
 */
export default function Head() {
    const { t, language } = useLanguage()
    const root = useRef<HTMLElement>(null)
    const accentRef = useRef<HTMLSpanElement>(null)

    // Live local time for the readout (after mount: avoids a hydration mismatch)
    const [time, setTime] = useState('')
    useEffect(() => {
        const fmt = () =>
            new Date().toLocaleTimeString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Africa/Casablanca',
            })
        setTime(fmt())
        const id = setInterval(() => setTime(fmt()), 30000)
        return () => clearInterval(id)
    }, [language])
    const years = new Date().getFullYear() - userData.user.startedAt

    // the stack: WebGL scene + HTML labels on desktop, SVG band on phones / without WebGL
    const [mode, setMode] = useState<'unknown' | '3d' | 'svg'>('unknown')
    const onMode = useCallback((webgl: boolean) => setMode(webgl ? '3d' : 'svg'), [])
    const layers = useMemo(() => layerInfo(t), [t])

    /**
     * The hero entrance: ONE timeline, started as soon as the page is interactive.
     * atmosphere (grid) → headline, line by line → supporting text → CTAs → 3D stack + first
     * request → nav settles. The hidden start states are in CSS (first paint, no flash) and are
     * handed over to GSAP here; a CSS fallback reveals everything if this never runs.
     */
    useLayoutEffect(() => {
        const el = root.current
        if (!el) return
        const html = document.documentElement
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        // Did the CSS fallback already start revealing (very slow hydration)? Then don't hide again.
        // A re-run (Strict Mode, hot reload, coming back to the page) finds hero-live set: replay.
        const rerun = html.classList.contains('hero-live')
        const firstWord = el.querySelector<HTMLElement>('.hero-title .word-inner')
        const fallbackStarted = !rerun && (!firstWord || parseFloat(getComputedStyle(firstWord).opacity) > 0.5)
        if (reduced || !html.classList.contains('js-anim') || fallbackStarted) {
            html.classList.add('hero-live')
            startHero('atmosphere')
            startHero('stack')
            return
        }

        const title = el.querySelector<HTMLElement>('.hero-title')
        const nav = document.querySelector<HTMLElement>('header nav')
        const mobile = window.matchMedia('(max-width: 768px)').matches
        const rtl = document.documentElement.dir === 'rtl'

        let offExit = () => {}
        let stopFailsafe = () => {}
        const ctx = gsap.context(() => {
            // take over the CSS start state with explicit values (y: 0 so nothing stacks)
            const headline = title ? headlineIntro(title, { mobile, rtl }) : null
            gsap.set('.hero-bottom .supporting, .hero-bottom .actions, .hero-bottom .scroll-cue', { opacity: 0, y: 16 })
            html.classList.add('hero-live')

            // atmosphere → headline (lines, "systems" wipe, underline) → text → CTAs → 3D stack → nav
            // Created paused: hydration is one long task (~0.2–0.4 s measured), and a timeline
            // started inside it would have most of its motion "played" before the first frame.
            const tl = gsap.timeline({
                paused: true,
                defaults: { ease: 'power4.out' },
                onComplete: () => gsap.ticker.lagSmoothing(500, 33), // back to GSAP's default
            })
            tl.add(() => startHero('atmosphere'), 0)
            tl.from('.hero-meta > *', { y: 10, duration: 0.6, stagger: 0.06, ease: 'expo.out' }, 0)
            if (headline) tl.add(headline, 0.1)
            tl.to('.hero-bottom .supporting', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, mobile ? 0.55 : 0.7)
            tl.to('.hero-bottom .actions, .hero-bottom .scroll-cue', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, mobile ? 0.65 : 0.82)
            tl.add(() => startHero('stack'), mobile ? 0.8 : 1.0)
            if (nav) tl.fromTo(nav, { y: -8 }, { y: 0, duration: 0.7, ease: 'expo.out', clearProps: 'transform' }, 1.1)

            // Play as the loader's curtain lifts (it covers the hero until then, so an earlier
            // start would happen out of sight). The curtain uncovers the top of the screen ~0.25 s
            // into its slide. Failsafe: start after 2.5 s even if the loader never signals.
            // During the intro a long frame (e.g. the 3D canvas arriving) slows the motion, never skips it.
            gsap.ticker.lagSmoothing(100, 33)
            const play = () => {
                clearTimeout(failsafe)
                if (!tl.isActive() && tl.progress() === 0) gsap.delayedCall(0.25, () => tl.play())
            }
            const failsafe = setTimeout(play, 2500)
            offExit = onLoaderExit(play)
            stopFailsafe = () => clearTimeout(failsafe)
        }, el)
        return () => {
            offExit()
            stopFailsafe()
            gsap.ticker.lagSmoothing(500, 33)
            ctx.revert()
        }
    }, [])

    const scrollToWork = () => {
        const el = document.getElementById('projects')
        if (!el) return
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(el, { offset: -90 })
        else el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <StyledSelection ref={root} id="head" aria-label={t('hero.identity')}>
            <HeroGrid3D onMode={onMode} />
            <HeroLink heroRef={root} wordRef={accentRef} />
            {mode === '3d' && <HeroLayers layers={layers} label={t('hero.layers.label')} request={t('hero.layers.request')} />}

            <div className="hero-inner">
                <div className="hero-meta">
                    <div className="identity">
                        <span className="avatar">
                            <Image src={ProfilePic} alt="" width={36} height={36} priority />
                        </span>
                        <span>{t('hero.identity')}</span>
                    </div>
                    <div className="status">
                        <span className="dot" aria-hidden="true" />
                        {t('hero.available')}
                        <span className="sep" aria-hidden="true">
                            /
                        </span>
                        <span className="location">{t('hero.location')}</span>
                    </div>
                </div>

                <HeroHeadline a={t('hero.h1a')} accent={t('hero.h1accent')} b={t('hero.h1b')} rtl={language === 'ar'} accentRef={accentRef} />

                {/* phones: the stack gets its own band between the headline and the actions
                    (also the desktop fallback without WebGL) */}
                <div className={`hero-band${mode === 'svg' ? ' is-fallback' : ''}`}>
                    <HeroStackSvg layers={layers} label={t('hero.layers.label')} request={t('hero.layers.request')} hint={t('hero.layers.tap')} />
                </div>

                <div className="hero-bottom">
                    <p className="supporting">{t('hero.supporting')}</p>
                    <div className="actions">
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={openContactDrawer}
                            onMouseEnter={runRequest}
                            onFocus={runRequest}
                            aria-haspopup="dialog"
                        >
                            {t('hero.ctaPrimary')} <FiArrowUpRight aria-hidden="true" />
                        </button>
                        <a href="#projects" className="btn-ghost" onClick={(e) => { e.preventDefault(); scrollToWork() }}>
                            {t('hero.ctaSecondary')} <FiArrowDownRight aria-hidden="true" />
                        </a>
                    </div>
                    <div className="scroll-cue" aria-hidden="true">
                        <span className="line" />
                        {t('hero.scroll')}
                    </div>
                </div>

                {/* technical readout: factual details, anchored to the bottom of the first screen */}
                <dl className="hero-readout">
                    <div>
                        <dt>{t('hero.readout.coords')}</dt>
                        <dd>33.57° N, 7.59° W</dd>
                    </div>
                    <div>
                        <dt>{t('hero.readout.time')}</dt>
                        <dd>{time ? <time>{time}</time> : '—'} · GMT+1</dd>
                    </div>
                    <div>
                        <dt>{t('hero.readout.stack')}</dt>
                        <dd>Java · Spring · React · Next.js</dd>
                    </div>
                    <div>
                        <dt>{t('hero.readout.experience')}</dt>
                        <dd>
                            {years}+ {t('hero.readout.years')}
                        </dd>
                    </div>
                </dl>
            </div>
        </StyledSelection>
    )
}
