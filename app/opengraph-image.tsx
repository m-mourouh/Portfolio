import { ImageResponse } from 'next/server'
import data from '@/data/user.json'

// Generated social preview (LinkedIn, X, WhatsApp...) — matches the site's look.
export const runtime = 'edge'
export const alt = `${data.user.name} — ${data.user.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Grid background drawn as an SVG tile (the OG renderer doesn't support stacked gradients)
const gridTile = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><path d="M50 0H0V50" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/></svg>'
)}`

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 90px',
                    background: '#1a1a1a',
                    backgroundImage: `url("${gridTile}")`,
                    backgroundRepeat: 'repeat',
                    color: '#fff',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: '#c4ff00' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 7, background: '#c4ff00' }} />
                    PORTFOLIO
                </div>
                <div style={{ fontSize: 92, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>{data.user.name}</div>
                <div style={{ display: 'flex', fontSize: 44, marginTop: 18, color: '#d3d3d3' }}>
                    {data.user.title} · <span style={{ color: '#c4ff00', marginLeft: 12 }}>{data.user.address}</span>
                </div>
            </div>
        ),
        size
    )
}
