import Image from 'next/image'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { VscGithubAlt } from 'react-icons/vsc'
import Link from 'next/link'
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
}

// Helper function to map project names to translation keys
const getProjectKey = (projectName: string): string => {
    const keyMap: { [key: string]: string } = {
        'Carrefour': 'carrefour',
        'Channel': 'channel',
        'Visilab': 'visilab',
        'Mcoptic': 'mcoptic',
        'Linsenmax': 'linsenmax',
        'Chat GPT Clone V.1.0': 'chatGptV10',
        'Chat GPT Clone V.1.1': 'chatGptV11',
        'Translation APP': 'translationApp',
        'Hospital Management System': 'hospitalManagement',
        'Socotec': 'socotec',
        'COVID-19 DETECTION APP': 'covidDetection',
        'Instant beauté': 'instantBeaute',
        'Eden cosmetique': 'edenCosmetique',
        'LE NEW GOA': 'leNewGoa',
        'BOIS DÉTAIL': 'boisDetail',
        'Solene Delacroix': 'soleneDelacroix',
        '2MJ': '2mj',
        'Jungle Pizza': 'junglePizza',
        'Boutin David': 'boutinDavid',
        'GARAGE ONCINS': 'garageOncins',
        'Gourvat': 'gourvat',
        'AURELIE LEJEUNE': 'aurelieLejeune',
        'LE GRAND MENAGE': 'leGrandMenage'
    }
    return keyMap[projectName] || projectName.toLowerCase().replace(/\s+/g, '')
}

export default function ProjectCard({ project }: ProjectType) {
    const { t } = useLanguage()
    return (
        <div className="project-card">
            <div className="project-image">
                <Image
                    src={require(`../public/images/${
                        project.image || 'default-image.jpg'
                    }`)}
                    alt={project.name}
                    loading="lazy"
                />
                <div className="image-overlay">
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
