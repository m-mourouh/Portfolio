'use client'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { FiArrowUp, FiArrowDown, FiPlus, FiTrash2, FiUpload, FiX, FiEyeOff, FiSave, FiRefreshCw } from 'react-icons/fi'
import type { Project, Lang } from '@/lib/projects'
import { LANGS } from '@/lib/projects'
import { Badge, Button, Card, Field, Input, Notice, Textarea } from './ui'
import { PendingImage, useContent, useUnsavedWarning } from './useContent'
import { prepareImage, slugify } from './images'

type ProjectsFile = { data: Project[] }

const FEATURED = 4
const LANG_LABEL: Record<Lang, string> = { en: 'English', fr: 'Français', ar: 'العربية' }

// Detects the old projects.json format (plain-string description, texts in the language files)
const isOldFormat = (data: unknown) =>
    !!data &&
    Array.isArray((data as ProjectsFile).data) &&
    (data as ProjectsFile).data.some((p) => typeof (p as { description?: unknown }).description !== 'object')

// Fills in any missing fields so the form never breaks on partial data
const normalize = (p: Partial<Project>): Project => {
    const base = emptyProject()
    return {
        ...base,
        ...p,
        description: { ...base.description, ...(p.description || {}) },
        category: { ...base.category!, ...(p.category || {}) },
        appName: p.appName || '',
        role: { ...base.role, ...(p.role || {}) },
        highlights: { ...base.highlights, ...(p.highlights || {}) },
        links: { ...base.links, ...(p.links || {}) },
        year: p.year || '',
        stack: p.stack || [],
        gallery: p.gallery || [],
        focus: p.focus || '',
        hidden: !!p.hidden,
    }
}

const emptyProject = (): Project => ({
    id: '',
    name: '',
    appName: '',
    description: { en: '', fr: '', ar: '' },
    category: { en: '', fr: '', ar: '' },
    role: { en: '', fr: '', ar: '' },
    highlights: { en: [], fr: [], ar: [] },
    year: '',
    stack: [],
    links: { github: '', website: '' },
    image: '',
    focus: '',
    gallery: [],
    hidden: false,
})

export default function ProjectsEditor() {
    const { state, load, save } = useContent<ProjectsFile>('projects')
    const [items, setItems] = useState<Project[]>([])
    const [selected, setSelected] = useState(0)
    const [lang, setLang] = useState<Lang>('en')
    const [pending, setPending] = useState<Record<string, PendingImage>>({})
    const [dirty, setDirty] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string; link?: string } | null>(null)
    useUnsavedWarning(dirty)

    // (Re)load the editor whenever fresh content arrives from the server
    const loadedSha = useRef<string | null>(null)
    useEffect(() => {
        if (state.status === 'ready' && loadedSha.current !== state.sha && !isOldFormat(state.data)) {
            loadedSha.current = state.sha
            setItems(state.data.data.map(normalize))
            setSelected((i) => Math.min(i, Math.max(0, state.data.data.length - 1)))
            setPending({})
            setDirty(false)
        }
    }, [state])

    const visibleIndex = useMemo(() => {
        const map = new Map<number, number>()
        let v = 0
        items.forEach((p, i) => {
            if (!p.hidden) map.set(i, v++)
        })
        return map
    }, [items])

    const project = items[selected]
    // Ids of projects that already exist on the site: those stay fixed (they're used as keys)
    const savedIds = useMemo(
        () => new Set(state.status === 'ready' ? state.data.data.map((p) => p.id) : []),
        [state]
    )
    const isNew = !!project && !savedIds.has(project.id)

    const update = (patch: Partial<Project>) => {
        setItems((list) => list.map((p, i) => (i === selected ? { ...p, ...patch } : p)))
        setDirty(true)
        setMessage(null)
    }

    const move = (from: number, to: number) => {
        if (to < 0 || to >= items.length) return
        setItems((list) => {
            const next = [...list]
            const [it] = next.splice(from, 1)
            next.splice(to, 0, it)
            return next
        })
        setSelected(to)
        setDirty(true)
    }

    const add = () => {
        setItems((list) => [...list, emptyProject()])
        setSelected(items.length)
        setLang('en')
        setDirty(true)
    }

    const remove = () => {
        if (!project || !confirm(`Delete "${project.name || 'this project'}"? This takes effect when you save.`)) return
        setItems((list) => list.filter((_, i) => i !== selected))
        setSelected((i) => Math.max(0, i - 1))
        setDirty(true)
    }

    const onImage = async (files: FileList | null, target: 'cover' | 'gallery') => {
        if (!files || !project) return
        try {
            const prepared = await Promise.all(Array.from(files).map((f) => prepareImage(f, project.id || project.name)))
            setPending((p) => ({ ...p, ...Object.fromEntries(prepared.map((img) => [img.name, img])) }))
            if (target === 'cover') update({ image: prepared[0].name })
            else update({ gallery: [...project.gallery, ...prepared.map((i) => i.name)] })
        } catch (e) {
            setMessage({ tone: 'error', text: e instanceof Error ? e.message : 'Could not use this image.' })
        }
    }

    const imageSrc = (name: string) => pending[name]?.preview || `/images/${name}`

    const onSave = async () => {
        // Fill in ids for new projects from their name
        const prepared = items.map((p) => ({ ...p, id: p.id || slugify(p.name) }))
        const invalid = prepared.findIndex((p) => !p.name.trim() || !p.description.en.trim())
        if (invalid >= 0) {
            setSelected(invalid)
            setLang('en')
            setMessage({ tone: 'error', text: 'Each project needs a name and an English description.' })
            return
        }
        // Only upload images that are still used
        const used = new Set(prepared.flatMap((p) => [p.image, ...p.gallery]))
        const images = Object.values(pending).filter((img) => used.has(img.name))
        const size = images.reduce((n, i) => n + i.base64.length, 0)
        if (size > 3.8 * 1024 * 1024) {
            setMessage({ tone: 'error', text: 'Too many new images in one save. Save a few at a time.' })
            return
        }
        setSaving(true)
        const result = await save({ data: prepared }, images)
        setSaving(false)
        if (result.ok) {
            setMessage({
                tone: 'success',
                text: `Saved. The site updates automatically in about 1–2 minutes, once Vercel has redeployed.${result.removedImages.length ? ` Removed ${result.removedImages.length} unused image${result.removedImages.length > 1 ? 's' : ''}: ${result.removedImages.join(', ')}.` : ''}`,
                link: result.commitUrl,
            })
        } else {
            setMessage({ tone: 'error', text: result.error })
        }
    }

    if (state.status === 'loading') return <Notice $tone="info">Loading projects…</Notice>
    if (state.status === 'ready' && isOldFormat(state.data))
        return (
            <Notice $tone="error">
                The projects file on GitHub is still in the old format, so it can&apos;t be edited here yet. Commit and push
                the latest code to the branch the dashboard saves to (GITHUB_BRANCH), then{' '}
                <Button $small onClick={load}>
                    <FiRefreshCw /> Reload
                </Button>
            </Notice>
        )
    if (state.status === 'error')
        return (
            <Notice $tone="error">
                {state.error}{' '}
                <Button $small onClick={load}>
                    <FiRefreshCw /> Retry
                </Button>
            </Notice>
        )

    return (
        <Layout>
            <div className="top">
                <div>
                    <h1>Projects</h1>
                    <p>The first {FEATURED} visible projects are shown as large cards; the rest appear under “View All Projects”.</p>
                </div>
                <div className="actions">
                    {dirty && <span className="unsaved">Unsaved changes</span>}
                    <Button onClick={add}>
                        <FiPlus /> Add project
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

            <div className="cols">
                <Card className="list" as="nav" aria-label="Projects">
                    {items.map((p, i) => (
                        <div key={i} className={`row${i === selected ? ' active' : ''}`}>
                            <button className="pick" onClick={() => setSelected(i)}>
                                <span className="name">{p.name || 'Untitled project'}</span>
                                <span className="badges">
                                    {p.hidden ? (
                                        <Badge>
                                            <FiEyeOff />
                                            &nbsp;Hidden
                                        </Badge>
                                    ) : (visibleIndex.get(i) ?? 99) < FEATURED ? (
                                        <Badge $tone="accent">Featured</Badge>
                                    ) : null}
                                </span>
                            </button>
                            <span className="order">
                                <button onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${p.name} up`}>
                                    <FiArrowUp />
                                </button>
                                <button onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${p.name} down`}>
                                    <FiArrowDown />
                                </button>
                            </span>
                        </div>
                    ))}
                </Card>

                {project ? (
                    <Card className="form">
                        <div className="grid2">
                            <Field>
                                Name
                                <Input
                                    value={project.name}
                                    maxLength={80}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ name: e.target.value })}
                                    aria-invalid={!project.name.trim()}
                                />
                            </Field>
                            <Field>
                                ID
                                <Input
                                    value={project.id || slugify(project.name)}
                                    readOnly={!isNew}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ id: slugify(e.target.value) })}
                                />
                                <span className="hint">{isNew ? 'Set from the name. Lowercase letters, numbers and dashes.' : 'Fixed after creation.'}</span>
                            </Field>
                        </div>

                        <div className="tabs" role="tablist" aria-label="Language">
                            {LANGS.map((l) => (
                                <button key={l} role="tab" aria-selected={lang === l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>
                                    {LANG_LABEL[l]}
                                    {l !== 'en' && !project.description[l] && <span className="missing" title="No translation yet">•</span>}
                                </button>
                            ))}
                        </div>

                        <div className="localized" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            <Field>
                                Description {lang === 'en' ? '(required)' : '(falls back to English if empty)'}
                                <Textarea
                                    rows={4}
                                    maxLength={800}
                                    value={project.description[lang]}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update({ description: { ...project.description, [lang]: e.target.value } })}
                                    aria-invalid={lang === 'en' && !project.description.en.trim()}
                                />
                            </Field>
                            <Field>
                                My role
                                <Input
                                    maxLength={200}
                                    value={project.role[lang]}
                                    placeholder="e.g. Lead front-end developer"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ role: { ...project.role, [lang]: e.target.value } })}
                                />
                            </Field>
                            <Field>
                                Highlights
                                <Textarea
                                    rows={4}
                                    value={project.highlights[lang].join('\n')}
                                    placeholder="One highlight per line"
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        update({
                                            highlights: {
                                                ...project.highlights,
                                                [lang]: e.target.value.split('\n').slice(0, 8),
                                            },
                                        })
                                    }
                                    onBlur={() =>
                                        update({
                                            highlights: {
                                                ...project.highlights,
                                                [lang]: project.highlights[lang].map((h) => h.trim()).filter(Boolean),
                                            },
                                        })
                                    }
                                />
                                <span className="hint">One per line, up to 8.</span>
                            </Field>
                        </div>

                        <Field>
                            App name (optional)
                            <Input
                                value={project.appName || ''}
                                placeholder="e.g. Noon"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ appName: e.target.value })}
                            />
                        </Field>
                        {(['en', 'fr', 'ar'] as const).map((l) => (
                            <Field key={l}>
                                Category ({l.toUpperCase()})
                                <Input
                                    dir={l === 'ar' ? 'rtl' : undefined}
                                    value={project.category?.[l] || ''}
                                    placeholder={l === 'en' ? 'e.g. E-commerce platform' : ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        update({ category: { en: '', fr: '', ar: '', ...project.category, [l]: e.target.value } })
                                    }
                                />
                            </Field>
                        ))}
                        <Field>
                            Year
                            <Input
                                inputMode="numeric"
                                maxLength={4}
                                value={project.year || ''}
                                placeholder="e.g. 2025"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                            />
                        </Field>
                        <Field>
                            Tech stack
                            <Input
                                value={project.stack.join(', ')}
                                placeholder="React, TypeScript, Spring Boot"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ stack: e.target.value.split(',').map((s) => s.trimStart()).slice(0, 15) })}
                                onBlur={() => update({ stack: project.stack.map((s) => s.trim()).filter(Boolean) })}
                            />
                            <span className="hint">Comma separated.</span>
                        </Field>

                        <div className="grid2">
                            <Field>
                                Website
                                <Input
                                    type="url"
                                    value={project.links.website}
                                    placeholder="https://"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ links: { ...project.links, website: e.target.value } })}
                                />
                            </Field>
                            <Field>
                                Source code
                                <Input
                                    type="url"
                                    value={project.links.github}
                                    placeholder="https://github.com/…"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ links: { ...project.links, github: e.target.value } })}
                                />
                            </Field>
                        </div>

                        <div className="images">
                            <div>
                                <span className="label">Cover image</span>
                                <div className="cover">
                                    {project.image && project.image !== 'default-image.jpg' ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imageSrc(project.image)} alt="" />
                                    ) : (
                                        <span className="empty">No image</span>
                                    )}
                                </div>
                                <Field>
                                    Focal point
                                    <Input
                                        value={project.focus || ''}
                                        placeholder="50% 50%"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ focus: e.target.value })}
                                    />
                                    <span className="hint">Where crops center: horizontal% vertical% (e.g. 25% 40%).</span>
                                </Field>
                                <div className="img-actions">
                                    <label className="upload">
                                        <FiUpload /> Upload
                                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onImage(e.target.files, 'cover')} />
                                    </label>
                                    {project.image && (
                                        <Button $small onClick={() => update({ image: '' })}>
                                            <FiX /> Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="label">Gallery (screenshots in the popup slider)</span>
                                <div className="gallery">
                                    {project.gallery.map((g, gi) => (
                                        <div key={g} className="thumb">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={imageSrc(g)} alt="" />
                                            <button
                                                aria-label="Remove from gallery"
                                                onClick={() => update({ gallery: project.gallery.filter((_, x) => x !== gi) })}
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="upload add">
                                        <FiPlus />
                                        <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onImage(e.target.files, 'gallery')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bottom">
                            <label className="check">
                                <input type="checkbox" checked={project.hidden} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ hidden: e.target.checked })} />
                                Hide this project on the site
                            </label>
                            <Button $danger onClick={remove}>
                                <FiTrash2 /> Delete project
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card>No projects yet. Click “Add project”.</Card>
                )}
            </div>
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

    .cols {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 20px;
        align-items: start;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    }

    .list {
        padding: 8px;
        position: sticky;
        top: 76px;
        max-height: calc(100vh - 100px);
        overflow-y: auto;

        @media (max-width: 900px) {
            position: static;
            max-height: 320px;
        }
    }

    .row {
        display: flex;
        align-items: center;
        border-radius: 10px;

        &.active {
            background: #262626;
        }
        &:hover:not(.active) {
            background: #202020;
        }
    }

    .pick {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        padding: 10px 12px;
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;

        .name {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .badges:empty {
            display: none;
        }
    }

    .order {
        display: flex;
        padding-right: 6px;

        button {
            display: grid;
            place-items: center;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            border: none;
            background: none;
            color: #888;
            cursor: pointer;

            &:hover:not(:disabled) {
                color: #fff;
                background: #333;
            }
            &:disabled {
                opacity: 0.25;
                cursor: default;
            }
        }
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        @media (max-width: 640px) {
            grid-template-columns: 1fr;
        }
    }

    .tabs {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid #2d2d2d;

        button {
            padding: 10px 14px;
            border: none;
            background: none;
            color: #888;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
            cursor: pointer;

            &.active {
                color: #fff;
                border-bottom-color: #c4ff00;
            }
            .missing {
                color: #ffb347;
                margin-left: 4px;
            }
        }
    }

    .localized {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .images {
        display: grid;
        grid-template-columns: 240px 1fr;
        gap: 20px;

        @media (max-width: 640px) {
            grid-template-columns: 1fr;
        }

        .label {
            display: block;
            font-size: 0.85rem;
            color: #aaa;
            margin-bottom: 8px;
        }
    }

    .cover {
        aspect-ratio: 16 / 10;
        border-radius: 10px;
        border: 1px dashed #3a3a3a;
        overflow: hidden;
        display: grid;
        place-items: center;
        background: #141414;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .empty {
            color: #666;
            font-size: 0.85rem;
        }
    }

    .img-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
    }

    .upload {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 10px;
        border: 1px solid #3a3a3a;
        background: #262626;
        font-size: 0.85rem;
        cursor: pointer;

        &:hover {
            border-color: #555;
        }
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

    .gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .thumb {
            position: relative;
            width: 110px;
            aspect-ratio: 16 / 10;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #333;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            button {
                position: absolute;
                top: 4px;
                right: 4px;
                display: grid;
                place-items: center;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                border: none;
                background: rgba(0, 0, 0, 0.7);
                cursor: pointer;
            }
        }

        .add {
            width: 110px;
            aspect-ratio: 16 / 10;
            justify-content: center;
            border-style: dashed;
            font-size: 1.2rem;
        }
    }

    .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        padding-top: 8px;
        border-top: 1px solid #2d2d2d;
    }

    .check {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        color: #ccc;

        input {
            width: 18px;
            height: 18px;
            accent-color: #c4ff00;
        }
    }
`
