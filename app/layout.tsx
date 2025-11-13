import GoogleAnalytics from '@/components/GoogleAnalytics'
import Header from '@/components/Header'
import data from '@/data/user.json'
import { roboto, tajawal, space_grotesk } from '@/fonts/fonts'
import { GlobalStyle } from '@/styles/styled-components/Global'
import StyledComponentsRegistry from '../lib/registry'
import { Provider } from './providers'
export const metadata = {
    title: `${data.user.name} | Software Engineer | Portfolio`,
    description: `${data.user.name} website | `,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
                <GoogleAnalytics
                    GA_MEASUREMENT_ID={process.env.GA_TRACKING_ID!}
                />
            <body className={`${roboto.variable} ${tajawal.variable} ${space_grotesk.variable}`}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `<!-- Google Tag Manager (noscript) -->`,
                    }}
                />
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${process.env.GA_TRACKING_ID!}`}
                        height="0"
                        width="0"
                        className="gtm-iframe"
                    ></iframe>
                </noscript>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `End Google Tag Manager (noscript)`,
                    }}
                />
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
