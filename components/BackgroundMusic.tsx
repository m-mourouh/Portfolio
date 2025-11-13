'use client'
import { useEffect, useRef, useState } from 'react'
import { StyledBackgroundMusic } from '@/styles/styled-components/BackgroundMusic.styled'

export default function BackgroundMusic() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        // Auto-play immediately
        if (audioRef.current) {
            audioRef.current.volume = 0.15
            audioRef.current.play().then(() => {
                setIsPlaying(true)
            }).catch((error) => {
                // Autoplay was prevented, try again on user interaction
                const playOnInteraction = () => {
                    if (audioRef.current) {
                        audioRef.current.play().then(() => {
                            setIsPlaying(true)
                            document.removeEventListener('click', playOnInteraction)
                        })
                    }
                }
                document.addEventListener('click', playOnInteraction)
            })
        }
    }, [])

    return (
        <StyledBackgroundMusic>
            <audio
                ref={audioRef}
                loop
                src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"
            />

            {isPlaying && (
                <div className="music-visualizer">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}
        </StyledBackgroundMusic>
    )
}
