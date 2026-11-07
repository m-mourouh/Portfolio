import GoogleAnalytics from '@/components/GoogleAnalytics'
import Header from '@/components/Header'
import data from '@/data/user.json'
import profiles from '@/data/profiles.json'
import { siteUrl } from '@/lib/site'
import { roboto, tajawal, space_grotesk } from '@/fonts/fonts'
import { GlobalStyle } from '@/styles/styled-components/Global'
import StyledComponentsRegistry from '../lib/registry'
import { Provider } from './providers'

// Structured data so search engines understand who the site is about (rich results)
const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.user.name,
    jobTitle: data.user.title,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    address: { '@type': 'PostalAddress', addressLocality: 'Casablanca', addressCountry: 'MA' },
    sameAs: Object.values(profiles.data).filter(Boolean),
    knowsAbout: ['Java', 'Spring Boot', 'React', 'Next.js', 'Angular', 'Vue.js', 'TypeScript', 'Node.js', 'Python', 'AI'],
}

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
        <html lang="en">
            <body className={`${roboto.variable} ${tajawal.variable} ${space_grotesk.variable}`}>
                <GoogleAnalytics GA_MEASUREMENT_ID={process.env.GA_TRACKING_ID!} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
                />
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${process.env.GA_TRACKING_ID!}`}
                        height="0"
                        width="0"
                        className="gtm-iframe"
                    ></iframe>
                </noscript>
                <StyledComponentsRegistry>
                    <Provider>
                        <GlobalStyle />
                        <Header />
                        {children}
                    </Provider>
                </StyledComponentsRegistry>
            </body>
        </html>
    )
}
