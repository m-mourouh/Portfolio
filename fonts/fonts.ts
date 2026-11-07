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
    display: 'swap',
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
    fallback: ['Tahoma', 'Arial', 'sans-serif'],
})
