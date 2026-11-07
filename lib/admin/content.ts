import 'server-only'
import * as Yup from 'yup'

/**
 * Everything the dashboard is allowed to edit. Only these files can be written;
 * paths never come from the browser.
 */

const LANGS = ['en', 'fr', 'ar'] as const
const IMAGE_NAME = /^[a-z0-9][a-z0-9._-]{0,90}\.(jpe?g|png|webp)$/i
const httpUrl = (max = 500) =>
    Yup.string()
        .trim()
        .max(max)
        .matches(/^(https?:\/\/[^\s]+)?$/i, 'Must be an http(s) link')
        .default('')

const localized = (max: number, requiredEn = false) =>
    Yup.object(
        Object.fromEntries(
            LANGS.map((l) => [
                l,
                l === 'en' && requiredEn
                    ? Yup.string().trim().max(max).required('English text is required')
                    : Yup.string().trim().max(max).default(''),
            ])
        )
    )

const localizedList = (maxItems: number, maxLen: number) =>
    Yup.object(
        Object.fromEntries(
            LANGS.map((l) => [l, Yup.array(Yup.string().trim().max(maxLen).required()).max(maxItems).default([])])
        )
    )

const projectSchema = Yup.object({
    id: Yup.string()
        .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id: lowercase letters, numbers and dashes')
        .max(60)
        .required(),
    name: Yup.string().trim().max(80).required('Name is required'),
    appName: Yup.string().trim().max(60).default(''),
    description: localized(800, true),
    category: localized(60),
    role: localized(200),
    highlights: localizedList(8, 240),
    year: Yup.string().trim().matches(/^(\d{4})?$/, 'Year must be 4 digits, e.g. 2025').default(''),
    stack: Yup.array(Yup.string().trim().max(30).required()).max(15).default([]),
    links: Yup.object({ github: httpUrl(), website: httpUrl() }),
    image: Yup.string().matches(/^$|^[a-z0-9][a-z0-9._-]{0,90}\.(jpe?g|png|webp)$/i, 'Invalid image name').default(''),
    focus: Yup.string().trim().matches(/^(\d{1,3}% \d{1,3}%)?$/, 'Focal point must look like "30% 50%"').default(''),
    gallery: Yup.array(Yup.string().matches(IMAGE_NAME, 'Invalid image name').required()).max(12).default([]),
    hidden: Yup.boolean().default(false),
})

const articleSchema = Yup.object({
    title: Yup.string().trim().max(200).required('Title is required'),
    url: Yup.string().trim().max(500).matches(/^https:\/\/[^\s]+$/i, 'Must be an https link').required('Link is required'),
    date: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').required(),
    readingTime: Yup.number().integer().min(1).max(120).required(),
    tags: Yup.array(Yup.string().trim().max(30).required()).max(5).default([]),
    image: Yup.string()
        .trim()
        .matches(
            /^$|^https:\/\/cdn-images-1\.medium\.com\/[^\s]+$|^\/images\/[a-z0-9][a-z0-9._-]{0,90}\.(jpe?g|png|webp)$/i,
            'Image must be a Medium image link or an uploaded image'
        )
        .default(''),
})

export const CONTENT = {
    projects: {
        path: 'data/projects.json',
        label: 'projects',
        schema: Yup.object({ data: Yup.array(projectSchema).max(100).required() }),
        /** Image file names referenced by this content (must exist or be uploaded in the same save). */
        images: (d: { data: Array<{ image: string; gallery: string[] }> }) =>
            d.data.flatMap((p) => [p.image, ...p.gallery]).filter(Boolean),
        check: (d: { data: Array<{ id: string }> }) => {
            const ids = d.data.map((p) => p.id)
            const dup = ids.find((id, i) => ids.indexOf(id) !== i)
            return dup ? `Two projects use the same id "${dup}"` : null
        },
    },
    articles: {
        path: 'data/articles.json',
        label: 'articles',
        schema: Yup.object({
            profile: Yup.string().trim().matches(/^https:\/\/[^\s]+$/i, 'Profile must be an https link').required(),
            data: Yup.array(articleSchema).max(50).required(),
        }),
        images: (d: { data: Array<{ image: string }> }) =>
            d.data.map((a) => a.image).filter((i) => i.startsWith('/images/')).map((i) => i.slice('/images/'.length)),
        check: () => null,
    },
} as const

export type ContentKey = keyof typeof CONTENT
export const isContentKey = (k: string): k is ContentKey => Object.prototype.hasOwnProperty.call(CONTENT, k)

export const IMAGES_DIR = 'public/images'

/** Images the site's code uses directly: never deleted automatically. */
export const PROTECTED_IMAGES = new Set(['default-image.jpg', 'mohamed_mourouh.jpeg', 'logo.svg', 'loader.svg', 'mohamed_mourouh_signature.svg'])
export const isImageName = (n: string) => IMAGE_NAME.test(n)

const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024

/** Checks an uploaded image by its actual bytes (not just its name) and size. */
export function decodeImage(name: string, base64: string): Buffer {
    if (!isImageName(name)) throw new Error(`Invalid image name: ${name}`)
    const buf = Buffer.from(base64, 'base64')
    if (!buf.length || buf.length > MAX_IMAGE_BYTES) throw new Error(`Image too large (max 2.5 MB): ${name}`)
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
    const isPng = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    const isWebp = buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP'
    const ext = name.split('.').pop()!.toLowerCase()
    const ok =
        (isJpeg && (ext === 'jpg' || ext === 'jpeg')) || (isPng && ext === 'png') || (isWebp && ext === 'webp')
    if (!ok) throw new Error(`File is not a valid ${ext.toUpperCase()} image: ${name}`)
    return buf
}
