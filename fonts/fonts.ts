// Using system fonts as fallback due to Google Fonts API timeout issues during build
// These will use the CSS variable names but fallback to system fonts

import { Tajawal, Space_Grotesk } from 'next/font/google'

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

// Space Grotesk font for English and French text
export const space_grotesk = Space_Grotesk({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-space-grotesk',
    display: 'swap',
    fallback: ['system-ui', 'Arial', 'sans-serif'],
})

// Tajawal font for Arabic text
export const tajawal = Tajawal({
    weight: ['300', '400', '500', '700'],
    subsets: ['arabic'],
    variable: '--font-tajawal',
    display: 'swap',
    fallback: ['Tahoma', 'Arial', 'sans-serif'],
})