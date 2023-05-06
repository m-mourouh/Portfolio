import { Fira_Code, Roboto, Roboto_Mono ,Montserrat } from 'next/font/google'

export const fira_code = Fira_Code({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-fira-code',
    display: 'swap',
})

export const roboto = Roboto({
    weight: ['400', '700', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-roboto',
    display: 'swap',
})
export const roboto_mono = Roboto_Mono({
    weight: ['400', '500', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-roboto-mono',
    display: 'swap',
})
export const montserrat = Montserrat({
    weight: ['400', '700', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-montserrat',
    display:'swap',
})