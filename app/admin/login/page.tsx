'use client'
import { signIn } from 'next-auth/react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiGithub, FiLock } from 'react-icons/fi'
import styled from 'styled-components'
import { Button } from '@/components/admin/ui'

const ERRORS: Record<string, string> = {
    AccessDenied: "This GitHub account isn't allowed to access the dashboard.",
    Configuration: 'The admin login is not configured on the server yet.',
    OAuthSignin: 'Could not start GitHub sign-in. Check GITHUB_ID / GITHUB_SECRET and restart the server.',
    OAuthCallback: 'GitHub sign-in failed. Check that the OAuth App callback URL matches this site.',
}

// Reading ?error= needs a Suspense boundary so the rest of the page can be pre-rendered
export default function AdminLogin() {
    return (
        <Suspense fallback={null}>
            <LoginBox />
        </Suspense>
    )
}

function LoginBox() {
    const error = useSearchParams()?.get('error')
    return (
        <Wrap>
            <div className="box">
                <div className="lock">
                    <FiLock />
                </div>
                <h1>Portfolio admin</h1>
                <p>Sign in with the GitHub account that owns this site.</p>
                {error && <div className="error">{ERRORS[error] || 'Sign-in failed. Please try again.'}</div>}
                <Button $primary onClick={() => signIn('github', { callbackUrl: '/admin' })}>
                    <FiGithub /> Continue with GitHub
                </Button>
            </div>
        </Wrap>
    )
}

const Wrap = styled.main`
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;

    .box {
        width: 100%;
        max-width: 380px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        padding: 40px 32px;
        border-radius: 20px;
        border: 1px solid #2d2d2d;
        background: #1c1c1c;
    }

    .lock {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(196, 255, 0, 0.12);
        color: #c4ff00;
        font-size: 1.4rem;
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 600;
    }

    p {
        color: #999;
        margin-bottom: 10px;
    }

    .error {
        width: 100%;
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(255, 107, 107, 0.1);
        border: 1px solid rgba(255, 107, 107, 0.35);
        color: #ff8c8c;
        font-size: 0.9rem;
    }
`
