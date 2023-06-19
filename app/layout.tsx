import StyledComponentsRegistry from '../lib/registry'
import { GlobalStyle } from '@/styles/styled-components/Global'
import { Provider } from './providers'
import Header from '@/components/Header'
import data from '@/data/user.json'
import { roboto } from '@/fonts/fonts'
export const metadata = {
    title: `${data.user.name} | Front-End Enginner | Portfolio`,
    description: `${data.user.name} website | `,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${roboto.variable }`}>
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
