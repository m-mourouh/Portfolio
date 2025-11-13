'use client'
import { useEffect, useRef, useState } from 'react'
import { StyledBackgroundMusic } from '@/styles/styled-components/BackgroundMusic.styled'

export default function BackgroundMusic() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const attemptAutoplay = async () => {
            if (!audioRef.current) return

            try {
                // Start muted to bypass autoplay restrictions
                audioRef.current.muted = true
                audioRef.current.volume = 0.15

                await audioRef.current.play()

                // Unmute after a short delay
                setTimeout(() => {
                    if (audioRef.current) {
                        audioRef.current.muted = false
                        setIsPlaying(true)
                    }
                }, 100)
            } catch (error) {
                console.log('Autoplay blocked, waiting for user interaction')
                // Fallback: unmute on any user interaction
                const handleInteraction = async () => {
                    if (audioRef.current) {
                        audioRef.current.muted = false
                        try {
                            await audioRef.current.play()
                            setIsPlaying(true)
                        } catch (e) {
                            console.error('Play failed:', e)
                        }
                        document.removeEventListener('click', handleInteraction)
                        document.removeEventListener('keydown', handleInteraction)
                        document.removeEventListener('touchstart', handleInteraction)
                    }
                }
                document.addEventListener('click', handleInteraction)
                document.addEventListener('keydown', handleInteraction)
                document.addEventListener('touchstart', handleInteraction)
            }
        }

        attemptAutoplay()
    }, [])

    return (
        <StyledBackgroundMusic>
            <audio
                ref={audioRef}
                loop
                autoPlay
                playsInline
                src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"
            />

            {isPlaying && (
                <div className="music-visualizer">
                    {[0, 1, 2].map((i) => (
                        <span key={i}></span>
                    ))}
                </div>
            )}
        </StyledBackgroundMusic>
    )
}
