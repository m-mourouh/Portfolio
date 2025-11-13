'use client'
import { roboto, roboto_mono } from '@/fonts/fonts'
import projectData from '@/data/projects.json'
import { StyledProjects } from '@/styles/styled-components/Projects.styled'
import ProjectCard from './ProjectCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Projects() {
    const { t } = useLanguage()
    const activeProjects = projectData.data.filter((project) => !project.hidden)
    // Show only top 4 featured projects
    const featuredProjects = activeProjects.slice(0, 4)

    return (
        <StyledProjects id="projects" className={roboto_mono.variable}>
            <div className="projects-header">
                <h1 className={roboto.variable} dangerouslySetInnerHTML={{ __html: t('projects.title') }} />
            </div>
            <div className="projects-list">
                {featuredProjects.map((project, idx) => (
                    <ProjectCard project={project} key={idx} />
                ))}
            </div>
        </StyledProjects>
    )
}
