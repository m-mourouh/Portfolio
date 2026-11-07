// Fonts are self-hosted (files in this folder) so dev and build never depend on
// reaching Google Fonts. Files: Space Grotesk variable (latin), Tajawal (arabic).
import localFont from 'next/font/local'

export const roboto = {
    variable: '--font-roboto',
    style: { fontFamily: 'system-ui, -apple-system, sans-serif' }
}

export const roboto_mono = {
    variable: '--font-roboto-mono',
    style: { fontFamily: 'monospace' }
}

export const dancing_script = {
    variable: '--font-dancing-script',
    style: { fontFamily: 'cursive' }
}

// Space Grotesk font for English and French text (variable font, 300-700)
export const space_grotesk = localFont({
    src: './SpaceGrotesk-Variable-latin.woff2',
    weight: '300 700',
    style: 'normal',
    variable: '--font-space-grotesk',
    // 'optional': used if ready at first paint (preloaded, ~22KB), never swapped in later,
    // so text can't re-wrap and shift the layout (CLS). Repeat visits always get it from cache.
    display: 'optional',
    fallback: ['system-ui', 'Arial', 'sans-serif'],
})

// Tajawal font for Arabic text
export const tajawal = localFont({
    src: [
        { path: './Tajawal-300-arabic.woff2', weight: '300', style: 'normal' },
        { path: './Tajawal-400-arabic.woff2', weight: '400', style: 'normal' },
        { path: './Tajawal-500-arabic.woff2', weight: '500', style: 'normal' },
        { path: './Tajawal-700-arabic.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-tajawal',
    display: 'swap',
    // Arabic only: don't preload it on every page (it competed with the Latin fonts on slow networks)
    preload: false,
    fallback: ['Tahoma', 'Arial', 'sans-serif'],
})

// Instrument Serif italic: editorial display accent (e.g. one emphasized word in headlines)
export const instrument_serif = localFont({
    src: './InstrumentSerif-Italic-latin.woff2',
    weight: '400',
    style: 'italic',
    variable: '--font-serif-display',
    display: 'optional',
    // size-matched serif fallback so the swap doesn't re-flow the hero headline (layout shift)
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'Times New Roman', 'serif'],
})
