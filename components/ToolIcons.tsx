'use client'
import { JSX, cloneElement } from 'react'
import { FaGitAlt, FaGithub, FaGitlab, FaDocker, FaJenkins, FaFigma, FaRobot, FaProjectDiagram, FaJava } from 'react-icons/fa'
import {
    SiGrafana, SiCircleci, SiAsana, SiObsidian, SiVisualstudiocode, SiIntellijidea, SiHtml5, SiCss3, SiSass, SiTailwindcss,
    SiBootstrap, SiMui, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiSpring, SiNodedotjs,
    SiPython, SiMysql, SiPostgresql, SiMongodb, SiFirebase,
} from 'react-icons/si'

// inline SVG icons (bundled, no per-icon requests), keyed by the technology names in lib/expertise.ts
const ICONS: Record<string, JSX.Element> = {
    HTML: <SiHtml5 />, CSS: <SiCss3 />, SASS: <SiSass />, 'Tailwind CSS': <SiTailwindcss />, Bootstrap: <SiBootstrap />,
    'Material UI': <SiMui />, JavaScript: <SiJavascript />, TypeScript: <SiTypescript />, 'React.js': <SiReact />,
    'Next.js': <SiNextdotjs />, 'Vue.js': <SiVuedotjs />, Angular: <SiAngular />, Java: <FaJava />, 'Node.js': <SiNodedotjs />,
    Python: <SiPython />, 'Spring Framework': <SiSpring />, MySQL: <SiMysql />, PostgreSQL: <SiPostgresql />, MongoDB: <SiMongodb />,
    FireBase: <SiFirebase />, Claude: <FaRobot />, N8N: <FaProjectDiagram />, Git: <FaGitAlt />, GitHub: <FaGithub />,
    GitLab: <FaGitlab />, Docker: <FaDocker />, Jenkins: <FaJenkins />, CircleCI: <SiCircleci />, Grafana: <SiGrafana />,
    Figma: <FaFigma />, Asana: <SiAsana />, Obsidian: <SiObsidian />, 'VS Code': <SiVisualstudiocode />, 'IntelliJ IDEA': <SiIntellijidea />,
}

// decorative: the technology's name is always written next to its icon
export default function ToolIcon({ tool }: { tool: string }) {
    const icon = ICONS[tool]
    return icon ? cloneElement(icon, { 'aria-hidden': true, focusable: false }) : null
}
