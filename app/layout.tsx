import StyledComponentsRegistry from '../lib/registry'
import { GlobalStyle } from '@/styles/styled-components/Global'
import { Provider } from './providers'
import Header from '@/components/Header'
import data from '@/data/user.json'
import { roboto } from '@/fonts/fonts'
import GoogleAnalytics from '@/components/GoogleAnalytics'
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
        <html lang="en" >
            <GoogleAnalytics GA_MEASUREMENT_ID={process.env.GA_TRACKING_ID!} />
            <body className={`${roboto.variable}`}>
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
