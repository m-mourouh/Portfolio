'use client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BPM } from '@/lib/music'
import { MUSIC_STATE_EVENT, toggleMusic } from './BackgroundMusic'
import { useLanguage } from '@/contexts/LanguageContext'

/** Play/pause button for the background music; bars bounce on the beat while playing. */
export default function MusicToggle({ className = '', showLabel = false }: { className?: string; showLabel?: boolean }) {
    const { t } = useLanguage()
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        const onState = (e: Event) => setPlaying(Boolean((e as CustomEvent<boolean>).detail))
        window.addEventListener(MUSIC_STATE_EVENT, onState)
        return () => window.removeEventListener(MUSIC_STATE_EVENT, onState)
    }, [])

    const label = playing ? t('music.pause') : t('music.play')
    return (
        <Btn
            type="button"
            data-music-toggle
            onClick={toggleMusic}
            aria-pressed={playing}
            aria-label={label}
            title={label}
            className={`${className}${playing ? ' playing' : ''}`}
            style={{ ['--beat' as string]: `${60 / BPM}s` }}
        >
            {[0, 1, 2, 3].map((i) => (
                <span key={i} />
            ))}
            {showLabel && (
                <em className="music-label" aria-hidden="true">
                    {playing ? t('music.on') : t('music.off')}
                </em>
            )}
        </Btn>
    )
}

const Btn = styled.button`
    display: inline-flex;
    align-items: flex-end;
    justify-content: center;
    gap: 3px;
    width: 50px;
    height: 50px;
    padding: 17px 0;
    border-radius: 12px;
    border: 1px solid rgb(57, 57, 57);
    background: rgb(44, 44, 44);
    cursor: pointer;
    transition: border-color 0.25s ease;

    &:hover,
    &:focus-visible {
        border-color: var(--c-accent);
    }

    /* labelled variant: bars + "Sound off / on" */
    &:has(.music-label) {
        width: auto;
        height: 44px;
        padding: 0 14px;
        align-items: center;
        gap: 3px;
    }
    .music-label {
        margin-inline-start: 8px;
        font-style: normal;
        font-size: 14px;
        line-height: 1;
        color: var(--c-text);
        white-space: nowrap;
    }

    /* resting heights read as an equalizer even while paused */
    span {
        width: 3px;
        height: 6px;
        border-radius: 2px;
        background: #8a8a8a;
        transition: background-color 0.3s ease, height 0.3s ease;

        &:nth-child(2) {
            height: 11px;
        }
        &:nth-child(3) {
            height: 8px;
        }
        &:nth-child(4) {
            height: 4px;
        }
    }

    &.playing span {
        background: var(--c-accent);
        animation: music-bars var(--beat, 0.5s) ease-in-out infinite;

        &:nth-child(1) {
            --peak: 9px;
        }
        &:nth-child(2) {
            --peak: 15px;
            animation-delay: calc(var(--beat, 0.5s) * -0.25);
        }
        &:nth-child(3) {
            --peak: 12px;
            animation-delay: calc(var(--beat, 0.5s) * -0.5);
        }
        &:nth-child(4) {
            --peak: 7px;
            animation-delay: calc(var(--beat, 0.5s) * -0.75);
        }
    }

    @keyframes music-bars {
        0%,
        100% {
            height: 4px;
        }
        50% {
            height: var(--peak, 12px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        &.playing span {
            animation: none;
            height: 11px;
        }
    }
`
