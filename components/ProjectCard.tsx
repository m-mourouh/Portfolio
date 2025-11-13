import Image from 'next/image'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { VscGithubAlt } from 'react-icons/vsc'
import Link from 'next/link'
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
export default function ProjectCard({ project }: ProjectType) {
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
                <p className="project-description">{project.description}</p>
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
