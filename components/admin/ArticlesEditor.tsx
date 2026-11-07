'use client'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { FiPlus, FiTrash2, FiSave, FiUpload, FiRefreshCw } from 'react-icons/fi'
import { Button, Card, Field, Input, Notice } from './ui'
import { PendingImage, useContent, useUnsavedWarning } from './useContent'
import { prepareImage, slugify } from './images'

type Article = { title: string; url: string; date: string; readingTime: number; tags: string[]; image: string }
type ArticlesFile = { profile: string; data: Article[] }

const today = () => new Date().toISOString().slice(0, 10)

export default function ArticlesEditor() {
    const { state, load, save } = useContent<ArticlesFile>('articles')
    const [file, setFile] = useState<ArticlesFile | null>(null)
    const [pending, setPending] = useState<Record<string, PendingImage>>({})
    const [dirty, setDirty] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string; link?: string } | null>(null)
    useUnsavedWarning(dirty)

    const loadedSha = useRef<string | null>(null)
    useEffect(() => {
        if (state.status === 'ready' && loadedSha.current !== state.sha) {
            loadedSha.current = state.sha
            setFile(state.data)
            setPending({})
            setDirty(false)
        }
    }, [state])

    const change = (next: ArticlesFile) => {
        setFile(next)
        setDirty(true)
        setMessage(null)
    }
    const updateArticle = (i: number, patch: Partial<Article>) =>
        file && change({ ...file, data: file.data.map((a, x) => (x === i ? { ...a, ...patch } : a)) })

    const onImage = async (i: number, files: FileList | null) => {
        if (!files?.[0] || !file) return
        try {
            const img = await prepareImage(files[0], `article-${slugify(file.data[i].title) || 'cover'}`)
            setPending((p) => ({ ...p, [img.name]: img }))
            updateArticle(i, { image: `/images/${img.name}` })
        } catch (e) {
            setMessage({ tone: 'error', text: e instanceof Error ? e.message : 'Could not use this image.' })
        }
    }

    const onSave = async () => {
        if (!file) return
        const bad = file.data.findIndex((a) => !a.title.trim() || !/^https:\/\//.test(a.url.trim()))
        if (bad >= 0) {
            setMessage({ tone: 'error', text: `Article ${bad + 1} needs a title and an https:// link.` })
            return
        }
        const used = new Set(file.data.map((a) => a.image.replace('/images/', '')))
        const images = Object.values(pending).filter((img) => used.has(img.name))
        setSaving(true)
        const result = await save(file, images)
        setSaving(false)
        setMessage(
            result.ok
                ? {
                      tone: 'success',
                      text: `Saved. The site updates in about 1–2 minutes, once Vercel has redeployed.${result.removedImages.length ? ` Removed ${result.removedImages.length} unused image${result.removedImages.length > 1 ? 's' : ''}: ${result.removedImages.join(', ')}.` : ''}`,
                      link: result.commitUrl,
                  }
                : { tone: 'error', text: result.error }
        )
    }

    if (state.status === 'loading' || (state.status === 'ready' && !file)) return <Notice $tone="info">Loading articles…</Notice>
    if (state.status === 'error')
        return (
            <Notice $tone="error">
                {state.error}{' '}
                <Button $small onClick={load}>
                    <FiRefreshCw /> Retry
                </Button>
            </Notice>
        )
    if (!file) return null

    return (
        <Layout>
            <div className="top">
                <div>
                    <h1>Articles</h1>
                    <p>Shown in “Latest Writing”, newest first. Paste the Medium link, title and cover image link.</p>
                </div>
                <div className="actions">
                    {dirty && <span className="unsaved">Unsaved changes</span>}
                    <Button
                        onClick={() =>
                            change({ ...file, data: [{ title: '', url: '', date: today(), readingTime: 5, tags: [], image: '' }, ...file.data] })
                        }
                    >
                        <FiPlus /> Add article
                    </Button>
                    <Button $primary onClick={onSave} disabled={!dirty || saving}>
                        <FiSave /> {saving ? 'Saving…' : 'Save changes'}
                    </Button>
                </div>
            </div>

            {message && (
                <Notice $tone={message.tone} role="status">
                    {message.text}{' '}
                    {message.link && (
                        <a href={message.link} target="_blank" rel="noopener noreferrer">
                            View commit ↗
                        </a>
                    )}
                </Notice>
            )}

            <Card>
                <Field>
                    “More on Medium” link
                    <Input type="url" value={file.profile} onChange={(e: React.ChangeEvent<HTMLInputElement>) => change({ ...file, profile: e.target.value })} />
                </Field>
            </Card>

            {file.data.map((a, i) => (
                <Card key={i} className="article">
                    <div className="cover">
                        {a.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pending[a.image.replace('/images/', '')]?.preview || a.image} alt="" />
                        ) : (
                            <span>No cover</span>
                        )}
                    </div>
                    <div className="fields">
                        <Field>
                            Title
                            <Input value={a.title} maxLength={200} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateArticle(i, { title: e.target.value })} aria-invalid={!a.title.trim()} />
                        </Field>
                        <Field>
                            Link
                            <Input type="url" value={a.url} placeholder="https://medium.com/@…" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateArticle(i, { url: e.target.value })} />
                        </Field>
                        <div className="row3">
                            <Field>
                                Date
                                <Input type="date" value={a.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateArticle(i, { date: e.target.value })} />
                            </Field>
                            <Field>
                                Minutes to read
                                <Input
                                    type="number"
                                    min={1}
                                    max={120}
                                    value={a.readingTime}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateArticle(i, { readingTime: Math.max(1, Math.min(120, Number(e.target.value) || 1)) })}
                                />
                            </Field>
                            <Field>
                                Tags
                                <Input
                                    value={a.tags.join(', ')}
                                    placeholder="Java, Spring"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateArticle(i, { tags: e.target.value.split(',').map((t) => t.trimStart()).slice(0, 5) })}
                                    onBlur={() => updateArticle(i, { tags: a.tags.map((t) => t.trim()).filter(Boolean) })}
                                />
                            </Field>
                        </div>
                        <Field>
                            Cover image
                            <div className="img-row">
                                <Input
                                    value={a.image}
                                    placeholder="https://cdn-images-1.medium.com/… or upload"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateArticle(i, { image: e.target.value })}
                                />
                                <label className="upload">
                                    <FiUpload /> Upload
                                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onImage(i, e.target.files)} />
                                </label>
                            </div>
                            <span className="hint">Right-click the cover on Medium → “Copy image address”, or upload a file.</span>
                        </Field>
                        <div className="end">
                            <Button
                                $danger
                                $small
                                onClick={() =>
                                    confirm(`Delete "${a.title || 'this article'}"? This takes effect when you save.`) &&
                                    change({ ...file, data: file.data.filter((_, x) => x !== i) })
                                }
                            >
                                <FiTrash2 /> Delete
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </Layout>
    )
}

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        flex-wrap: wrap;

        h1 {
            font-size: 1.8rem;
            font-weight: 600;
        }
        p {
            color: #888;
            margin-top: 6px;
            font-size: 0.92rem;
        }
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 10px;
        .unsaved {
            color: #c4ff00;
            font-size: 0.85rem;
        }
    }

    .article {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 20px;

        @media (max-width: 760px) {
            grid-template-columns: 1fr;
        }
    }

    .cover {
        aspect-ratio: 16 / 9;
        border-radius: 10px;
        overflow: hidden;
        background: #141414;
        border: 1px dashed #3a3a3a;
        display: grid;
        place-items: center;
        color: #666;
        font-size: 0.85rem;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .fields {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .row3 {
        display: grid;
        grid-template-columns: 1fr 140px 1.4fr;
        gap: 12px;

        @media (max-width: 640px) {
            grid-template-columns: 1fr 1fr;
        }
    }

    .img-row {
        display: flex;
        gap: 8px;
    }

    .upload {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 0 14px;
        border-radius: 10px;
        border: 1px solid #3a3a3a;
        background: #262626;
        color: #f2f2f2;
        white-space: nowrap;
        cursor: pointer;

        &:focus-within {
            outline: 2px solid #c4ff00;
            outline-offset: 2px;
        }
        input {
            position: absolute;
            width: 1px;
            height: 1px;
            opacity: 0;
        }
    }

    .end {
        display: flex;
        justify-content: flex-end;
    }
`
