import { AdminGlobalStyle } from '@/components/admin/ui'

export const metadata = {
    title: 'Admin | Portfolio',
    robots: { index: false, follow: false },
}

// Admin section: plain layout (no site header, custom cursor, smooth scroll or analytics).
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div dir="ltr" lang="en">
            <AdminGlobalStyle />
            {children}
        </div>
    )
}
