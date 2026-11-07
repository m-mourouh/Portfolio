import Image from 'next/image'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { VscGithubAlt } from 'react-icons/vsc'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type ProjectType = {
    project: {
        name: string
        description: string
        stack: string[]
        links: {
            github: string
            website: string
        }
        image: string
    }
    /** Opens the project popup; receives the card image to animate from. */
    onOpen?: (imageEl: HTMLElement | null) => void
}

// Helper function to map project names to translation keys
export const getProjectKey = (projectName: string): string => {
    const keyMap: { [key: string]: string } = {
        'Quran AI': 'quranAi',
        'Carrefour': 'carrefour',
        'Chanel': 'channel',
        'Visilab': 'visilab',
        'Mcoptic': 'mcoptic',
        'Linsenmax': 'linsenmax',
        'Chat GPT Clone V.1.0': 'chatGptV10',
        'Chat GPT Clone V.1.1': 'chatGptV11',
        'Translation APP': 'translationApp',
        'Hospital Management System': 'hospitalManagement',
        'COVID-19 DETECTION APP': 'covidDetection',
        'Eden cosmetique': 'edenCosmetique',
        'Jungle Pizza': 'junglePizza'
    }
    return keyMap[projectName] || projectName.toLowerCase().replace(/\s+/g, '')
}

export default function ProjectCard({ project, onOpen }: ProjectType) {
    const { t } = useLanguage()
    const imageRef = useRef<HTMLDivElement>(null)
    const open = () => onOpen?.(imageRef.current)

    return (
        <div
            className="project-card"
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-label={`${t('projects.viewDetails')}: ${project.name}`}
            onClick={open}
            onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    open()
                }
            }}
        >
            <div className="project-image" ref={imageRef}>
                <Image
                    src={require(`../public/images/${
                        project.image || 'default-image.jpg'
                    }`)}
                    alt={project.name}
                    loading="lazy"
                />
                <div className="image-overlay">
                    <span className="view-details">{t('projects.viewDetails')} →</span>
                    <div className="card-links">
                        {project.links.github && (
                            <a
                                href={project.links.github}
                                className="link-icon"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <VscGithubAlt />
                            </a>
                        )}
                        {project.links.website && (
                            <a
                                href={project.links.website}
                                className="link-icon"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <HiOutlineExternalLink />
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-info">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">
                    {t(`projects.descriptions.${getProjectKey(project.name)}`)}
                </p>
                <div className="tech-stack">
                    {project.stack.map((tech, idx) => (
                        <span key={idx} className="tech-tag">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
