'use client'
import Link from 'next/link'
import styled from 'styled-components'
import { FiFolder, FiEdit3, FiGitBranch } from 'react-icons/fi'
import { Card, Notice } from './ui'

export default function AdminOverview({ repo, branch, configured }: { repo: string; branch: string; configured: boolean }) {
    return (
        <Wrap>
            <h1>Welcome back</h1>
            <p className="lead">Edit your portfolio content here. Every save is a commit to GitHub, and Vercel redeploys the site automatically (about 1–2 minutes).</p>

            {!configured && (
                <Notice $tone="error">
                    Saving is not configured yet: set GITHUB_CONTENT_TOKEN and GITHUB_REPO in the environment variables.
                </Notice>
            )}

            <div className="cards">
                <Link href="/admin/projects">
                    <Card className="link-card">
                        <FiFolder />
                        <h2>Projects</h2>
                        <p>Add, reorder, hide projects; descriptions in EN/FR/AR; images and screenshots.</p>
                    </Card>
                </Link>
                <Link href="/admin/articles">
                    <Card className="link-card">
                        <FiEdit3 />
                        <h2>Articles</h2>
                        <p>Medium articles shown in “Latest Writing”.</p>
                    </Card>
                </Link>
            </div>

            <p className="meta">
                <FiGitBranch /> Saving to <code>{repo}</code> on branch <code>{branch}</code>
            </p>
        </Wrap>
    )
}

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    h1 {
        font-size: 1.8rem;
        font-weight: 600;
    }
    .lead {
        color: #999;
        max-width: 70ch;
        line-height: 1.6;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;

        a {
            text-decoration: none;
        }
    }

    .link-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: border-color 0.2s;

        svg {
            font-size: 1.4rem;
            color: #c4ff00;
        }
        h2 {
            font-size: 1.15rem;
            font-weight: 600;
        }
        p {
            color: #999;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        &:hover {
            border-color: #555;
        }
    }

    .meta {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #777;
        font-size: 0.85rem;

        code {
            color: #bbb;
        }
    }
`
