'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import styled from 'styled-components'
import { FiGrid, FiFolder, FiEdit3, FiLogOut, FiExternalLink } from 'react-icons/fi'

const NAV = [
    { href: '/admin', label: 'Overview', icon: <FiGrid /> },
    { href: '/admin/projects', label: 'Projects', icon: <FiFolder /> },
    { href: '/admin/articles', label: 'Articles', icon: <FiEdit3 /> },
]

export default function AdminShell({ login, avatar, children }: { login: string; avatar: string; children: React.ReactNode }) {
    const pathname = usePathname()
    return (
        <Shell>
            <header>
                <div className="brand">
                    <span className="dot" /> Portfolio admin
                </div>
                <nav aria-label="Admin">
                    {NAV.map((n) => (
                        <Link key={n.href} href={n.href} className={pathname === n.href ? 'active' : ''} aria-current={pathname === n.href ? 'page' : undefined}>
                            {n.icon}
                            <span>{n.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="user">
                    <a href="/" target="_blank" rel="noopener noreferrer" className="site-link">
                        View site <FiExternalLink />
                    </a>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {avatar && <img src={avatar} alt="" width={28} height={28} />}
                    <span className="login">@{login}</span>
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} aria-label="Sign out" title="Sign out">
                        <FiLogOut />
                    </button>
                </div>
            </header>
            <main>{children}</main>
        </Shell>
    )
}

const Shell = styled.div`
    min-height: 100vh;

    header {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 24px;
        padding: 12px 24px;
        background: rgba(20, 20, 20, 0.92);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid #262626;

        @media (max-width: 760px) {
            flex-wrap: wrap;
            gap: 12px;
            padding: 12px 16px;
        }
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;

        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #c4ff00;
        }
    }

    nav {
        display: flex;
        gap: 4px;
        flex: 1;

        a {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 8px;
            color: #aaa;
            text-decoration: none;
            font-size: 0.92rem;

            &:hover {
                color: #fff;
                background: #1f1f1f;
            }
            &.active {
                color: #fff;
                background: #262626;
            }
        }

        @media (max-width: 760px) {
            order: 3;
            width: 100%;
        }
    }

    .user {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.9rem;
        color: #aaa;

        img {
            border-radius: 50%;
        }
        .site-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            &:hover {
                color: #fff;
            }
        }
        button {
            display: grid;
            place-items: center;
            width: 34px;
            height: 34px;
            border-radius: 8px;
            border: 1px solid #333;
            background: none;
            cursor: pointer;
            &:hover {
                border-color: #ff6b6b;
                color: #ff8c8c;
            }
        }

        @media (max-width: 760px) {
            margin-left: auto;
            .login,
            .site-link {
                display: none;
            }
        }
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px 24px 80px;

        @media (max-width: 760px) {
            padding: 20px 16px 60px;
        }
    }
`
