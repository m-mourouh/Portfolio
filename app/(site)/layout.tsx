import GoogleAnalytics from '@/components/GoogleAnalytics'
import Header from '@/components/Header'
import data from '@/data/user.json'
import profiles from '@/data/profiles.json'
import { siteUrl } from '@/lib/site'
import { GlobalStyle } from '@/styles/styled-components/Global'

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


// Public site layout: header, global site styles (custom cursor, smooth scroll), analytics.
// The /admin section has its own layout without these.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <GoogleAnalytics GA_MEASUREMENT_ID={process.env.GA_TRACKING_ID!} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
            <noscript>
                <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${process.env.GA_TRACKING_ID!}`}
                    height="0"
                    width="0"
                    className="gtm-iframe"
                ></iframe>
            </noscript>
            <GlobalStyle />
            <Header />
            {children}
        </>
    )
}
