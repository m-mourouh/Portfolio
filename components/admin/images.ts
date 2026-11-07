'use client'
import type { PendingImage } from './useContent'

const MAX_SIDE = 1600

/**
 * Resizes an image in the browser (max 1600px, WebP ~82% quality) before upload,
 * keeping saves small and fast. Returns a unique, safe file name.
 */
export async function prepareImage(file: File, baseName: string): Promise<PendingImage> {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Please choose a JPG, PNG or WebP image.')
    if (file.size > 25 * 1024 * 1024) throw new Error('Image is too large (max 25 MB before resizing).')

    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    let blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82))
    let ext = 'webp'
    if (!blob || blob.type !== 'image/webp') {
        blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85))
        ext = 'jpg'
    }
    if (!blob) throw new Error('Could not process this image.')

    const preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Could not read the image.'))
        reader.readAsDataURL(blob!)
    })
    const safeBase = (baseName || 'image').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'image'
    const name = `${safeBase}-${Date.now().toString(36)}.${ext}`
    return { name, base64: preview.split(',')[1], preview }
}

export const slugify = (s: string) =>
    s
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60)
