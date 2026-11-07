import data from '@/data/user.json'
import { siteUrl } from '@/lib/site'
import { roboto, tajawal, space_grotesk, instrument_serif } from '@/fonts/fonts'
import StyledComponentsRegistry from '../lib/registry'
import { Provider } from './providers'

const title = `${data.user.name} | ${data.user.title} | Portfolio`
const description = `${data.user.name}, ${data.user.title} based in ${data.user.address}. I build scalable web platforms, enterprise systems and AI-powered products with Java, Spring Boot, React and Next.js.`

export const metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    authors: [{ name: data.user.name }],
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        title,
        description,
        siteName: data.user.name,
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Before first paint: lets CSS start the hero words hidden inside their reserved space
                    (no layout jump, no flash). A CSS fallback reveals them if JS never runs the animation. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-anim')}catch(e){}",
                    }}
                />
            </head>
            {/* GSAP ScrollTrigger touches body.style while measuring (before hydration): not a real mismatch */}
            <body
                className={`${roboto.variable} ${tajawal.variable} ${space_grotesk.variable} ${instrument_serif.variable}`}
                suppressHydrationWarning
            >
                <StyledComponentsRegistry>
                    <Provider>{children}</Provider>
                </StyledComponentsRegistry>
            </body>
        </html>
    )
}
