'use client'
import { FaGitAlt, FaGithub, FaGitlab, FaDocker, FaJenkins, FaFigma, FaRobot, FaProjectDiagram } from 'react-icons/fa'
import { SiGrafana, SiCircleci, SiAsana, SiObsidian, SiVisualstudiocode, SiIntellijidea } from 'react-icons/si'

interface ToolIconProps {
    tool: string
}

export default function ToolIcon({ tool }: ToolIconProps) {
    const iconMap: Record<string, JSX.Element> = {
        'Git': <FaGitAlt />,
        'GitHub': <FaGithub />,
        'GitLab': <FaGitlab />,
        'Docker': <FaDocker />,
        'Jenkins': <FaJenkins />,
        'Grafana': <SiGrafana />,
        'CircleCI': <SiCircleci />,
        'Figma': <FaFigma />,
        'Asana': <SiAsana />,
        'Obsidian': <SiObsidian />,
        'Claude': <FaRobot />,
        'N8N': <FaProjectDiagram />,
        'VS Code': <SiVisualstudiocode />,
        'IntelliJ IDEA': <SiIntellijidea />,
    }

    return iconMap[tool] || null
}
