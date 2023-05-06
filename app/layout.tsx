import StyledComponentsRegistry from '../lib/registry'
import { GlobalStyle } from '@/styles/styled-components/Global'
import { Provider } from './providers'
import Header from '@/components/Header'
import data from '@/data/data.json'
import { roboto } from '@/fonts/fonts'
export const metadata = {
    title: `${data.user.name}`,
    description: `${data.user.name} profile website`,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${roboto.variable}`}>
                <StyledComponentsRegistry>
                    <Provider>
                        <GlobalStyle />
                        <Header/>
                        {children}
                    </Provider>
                </StyledComponentsRegistry>
            </body>
        </html>
    )
}
