import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { ValidationError } from 'yup'
import { getAdminSession } from '@/lib/admin/auth'
import { CONTENT, ContentKey, IMAGES_DIR, PROTECTED_IMAGES, decodeImage, isContentKey } from '@/lib/admin/content'
import { CommitFile, DeleteFile, GithubError, commitFiles, listFolder, readFile } from '@/lib/admin/github'

// Same id git/GitHub gives a file's content ("blob sha"), so the editor can detect later conflicts
const blobSha = (text: string) => {
    const buf = Buffer.from(text, 'utf-8')
    return createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex')
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const json = (body: unknown, status = 200) =>
    NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

// Rejects requests coming from other websites (CSRF protection for the JSON API)
const sameOrigin = (req: NextRequest) => {
    const origin = req.headers.get('origin')
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
    if (!origin || !host) return false
    try {
        return new URL(origin).host === host
    } catch {
        return false
    }
}

// Image names a content file references (tolerates old/invalid data by returning none)
const imagesOf = (key: ContentKey, data: unknown): string[] => {
    try {
        return CONTENT[key].images(data as never)
    } catch {
        return []
    }
}

const fail = (e: unknown) => {
    if (e instanceof GithubError) return json({ error: e.message }, e.status)
    console.error('Admin content error', e)
    return json({ error: 'Something went wrong.' }, 500)
}

/** Load the latest version of a content file (straight from GitHub, not the deployed copy). */
export async function GET(_req: NextRequest, { params }: { params: { key: string } }) {
    if (!(await getAdminSession())) return json({ error: 'Unauthorized' }, 401)
    if (!isContentKey(params.key)) return json({ error: 'Unknown content' }, 404)
    try {
        const { text, sha } = await readFile(CONTENT[params.key].path)
        return json({ data: JSON.parse(text), sha })
    } catch (e) {
        return fail(e)
    }
}

type SaveBody = {
    data: unknown
    sha: string
    images?: Array<{ name: string; base64: string }>
}

/** Validate and save a content file (plus any new images) as one commit. */
export async function POST(req: NextRequest, { params }: { params: { key: string } }) {
    const session = await getAdminSession()
    if (!session) return json({ error: 'Unauthorized' }, 401)
    if (!sameOrigin(req)) return json({ error: 'Forbidden' }, 403)
    if (!isContentKey(params.key)) return json({ error: 'Unknown content' }, 404)
    if (!req.headers.get('content-type')?.includes('application/json')) return json({ error: 'Expected JSON' }, 415)

    const entry = CONTENT[params.key]
    let body: SaveBody
    try {
        body = await req.json()
    } catch {
        return json({ error: 'Invalid JSON' }, 400)
    }

    try {
        // 1. Validate and clean the content (unknown fields are dropped)
        const data: any = await entry.schema.validate(body.data, { abortEarly: true, stripUnknown: true })
        const problem = entry.check(data)
        if (problem) return json({ error: problem }, 400)

        // 2. Validate uploaded images by their bytes
        const images = Array.isArray(body.images) ? body.images.slice(0, 15) : []
        const files: Array<CommitFile | DeleteFile> = images.map((img) => ({
            path: `${IMAGES_DIR}/${img.name}`,
            content: decodeImage(String(img.name), String(img.base64)).toString('base64'),
            encoding: 'base64',
        }))

        // 3. Every referenced image must exist, or the site build would break
        const uploaded = new Set(images.map((i) => i.name))
        const existing = new Set(await listFolder(IMAGES_DIR))
        const missing = entry.images(data).find((name: string) => !uploaded.has(name) && !existing.has(name))
        if (missing) return json({ error: `Image "${missing}" does not exist. Upload it again.` }, 400)

        // 4. Refuse to overwrite changes made elsewhere since this page loaded
        const current = await readFile(entry.path).catch((e) => {
            if (e instanceof GithubError && e.status === 404) return null
            throw e
        })
        if (current && current.sha !== body.sha) {
            return json({ error: 'This content was changed elsewhere since you opened it. Reload the page and try again.' }, 409)
        }

        // 5. Remove images this content no longer uses, if nothing else uses them either:
        //    only images this content used before, not used by any other content, not used by the code
        let removed: string[] = []
        if (current) {
            const before = new Set(imagesOf(params.key, JSON.parse(current.text)))
            const stillUsed = new Set(entry.images(data))
            const others = (Object.keys(CONTENT) as ContentKey[]).filter((k) => k !== params.key)
            for (const k of others) {
                const other = await readFile(CONTENT[k].path).catch(() => null)
                if (other) imagesOf(k, JSON.parse(other.text)).forEach((n) => stillUsed.add(n))
            }
            removed = Array.from(before).filter(
                (n) => !stillUsed.has(n) && !uploaded.has(n) && !PROTECTED_IMAGES.has(n) && existing.has(n)
            )
            removed.forEach((n) => files.push({ path: `${IMAGES_DIR}/${n}`, delete: true }))
        }

        const text = JSON.stringify(data, null, 4) + '\n'
        files.push({ path: entry.path, content: text, encoding: 'utf-8' })
        const who = session.login ? ` (by @${session.login})` : ''
        const commitUrl = await commitFiles(files, `content: update ${entry.label} via admin dashboard${who}`)
        return json({ ok: true, commitUrl, sha: blobSha(text), data, removedImages: removed })
    } catch (e) {
        if (e instanceof ValidationError) return json({ error: e.errors[0] || 'Invalid content' }, 400)
        if (e instanceof Error && /image/i.test(e.message)) return json({ error: e.message }, 400)
        return fail(e)
    }
}
