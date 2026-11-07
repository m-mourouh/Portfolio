import 'server-only'

/**
 * Minimal GitHub client for the admin dashboard.
 * Uses a fine-grained token (GITHUB_CONTENT_TOKEN) limited to this repository's contents.
 * Several files are written as ONE commit (Git Data API), so one save = one deploy.
 */

const API = 'https://api.github.com'

const config = () => {
    const token = process.env.GITHUB_CONTENT_TOKEN
    const repo = process.env.GITHUB_REPO
    const branch = process.env.GITHUB_BRANCH || 'main'
    if (!token || !repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
        throw new GithubError('Admin is not configured (GITHUB_CONTENT_TOKEN / GITHUB_REPO).', 500)
    }
    return { token, repo, branch }
}

export class GithubError extends Error {
    constructor(message: string, public status: number) {
        super(message)
    }
}

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
    const { token, repo } = config()
    const res = await fetch(`${API}/repos/${repo}${path}`, {
        ...init,
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        },
    })
    if (!res.ok) {
        // Never forward GitHub's raw error (could include details); log it server-side only
        console.error('GitHub API error', res.status, path, await res.text().catch(() => ''))
        throw new GithubError(res.status === 404 ? 'Not found on GitHub.' : 'GitHub request failed.', res.status === 404 ? 404 : 502)
    }
    return res.json() as Promise<T>
}

/** Reads a text file from the content branch. `sha` identifies this exact version (for conflict checks). */
export async function readFile(path: string): Promise<{ text: string; sha: string }> {
    const { branch } = config()
    const file = await gh<{ content: string; sha: string; encoding: string }>(
        `/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`
    )
    return { text: Buffer.from(file.content, 'base64').toString('utf-8'), sha: file.sha }
}

/** Current blob sha of a file (to detect edits made elsewhere since it was loaded). */
export async function fileSha(path: string): Promise<string | null> {
    try {
        return (await readFile(path)).sha
    } catch (e) {
        if (e instanceof GithubError && e.status === 404) return null
        throw e
    }
}

/** Names of the files in a repo folder (e.g. to check referenced images exist). */
export async function listFolder(path: string): Promise<string[]> {
    const { branch } = config()
    try {
        const items = await gh<Array<{ name: string; type: string }>>(
            `/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`
        )
        return items.filter((i) => i.type === 'file').map((i) => i.name)
    } catch (e) {
        if (e instanceof GithubError && e.status === 404) return []
        throw e
    }
}

export type CommitFile = { path: string; content: string; encoding: 'utf-8' | 'base64' }
export type DeleteFile = { path: string; delete: true }

/** Writes (and deletes) files in a single commit on the content branch and returns the commit URL. */
export async function commitFiles(files: Array<CommitFile | DeleteFile>, message: string): Promise<string> {
    const { branch } = config()
    const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${encodeURIComponent(branch)}`)
    const parent = ref.object.sha
    const parentCommit = await gh<{ tree: { sha: string } }>(`/git/commits/${parent}`)

    const tree: Array<{ path: string; mode: string; type: string; sha: string | null }> = []
    for (const f of files) {
        if ('delete' in f) {
            // sha: null removes the file in the new tree
            tree.push({ path: f.path, mode: '100644', type: 'blob', sha: null })
            continue
        }
        const blob = await gh<{ sha: string }>(`/git/blobs`, {
            method: 'POST',
            body: JSON.stringify({ content: f.content, encoding: f.encoding }),
        })
        tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha })
    }

    const newTree = await gh<{ sha: string }>(`/git/trees`, {
        method: 'POST',
        body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree }),
    })
    const commit = await gh<{ sha: string; html_url: string }>(`/git/commits`, {
        method: 'POST',
        body: JSON.stringify({ message, tree: newTree.sha, parents: [parent] }),
    })
    // Not forced: if the branch moved in the meantime this fails instead of overwriting history
    await gh(`/git/refs/heads/${encodeURIComponent(branch)}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha, force: false }),
    })
    return commit.html_url
}
