import Image from 'next/image'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { VscGithubAlt } from 'react-icons/vsc'
import Link from 'next/link'
import { fira_code } from '@/fonts/fonts'
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
            <div className="left-col">
                <div className="top-card">
                    <h5 className="title">{project.name.toLowerCase()}</h5>
                    <div className="line"></div>
                </div>
                <div className="project-image">
                    <Image
                        src={require(`../public/images/${
                            project.image || 'default-image.jpg'
                        }`)}
                        alt=""
                        loading="lazy"
                    />
                    <div className="links">
                        {project.links.github && (
                            <Link
                                href={project.links.github}
                                className="link"
                                target="_blank"
                            >
                                <VscGithubAlt />
                            </Link>
                        )}
                        {project.links.website && (
                            <Link
                                href={project.links.website}
                                className="link"
                                target="_blank"
                            >
                                <HiOutlineExternalLink />
                            </Link>
                        )}
                    </div>
                </div>
                <div className="bottom-card">
                    <div className="line"></div>
                    <div className="list">
                        {project.stack.map((technology, idx) => (
                            <small className={fira_code.variable} key={idx}>
                                {technology.toLowerCase()}
                            </small>
                        ))}
                    </div>
                </div>

                <Link
                    href={
                        project.links.website != ''
                            ? project.links.website
                            : project.links.github
                    }
                    target="_blank"
                    className="project-link"
                ></Link>
            </div>
            <div className="right-col">
                <p>{project.description}</p>
            </div>
        </div>
    )
}
