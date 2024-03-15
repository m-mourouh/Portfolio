'use client'
import { fira_code, roboto, roboto_mono } from '@/fonts/fonts'
import projectData from '@/data/projects.json'
import { StyledProjects } from '@/styles/styled-components/Projects.styled'
import ProjectCard from './ProjectCard'
import React, { useState } from 'react'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { BiListMinus, BiListPlus } from 'react-icons/bi'

export default function Projects({
    numberOfProjects,
}: {
    numberOfProjects: number
}) {
    const activeProjects = projectData.data.filter((project) => !project.hidden)
    const [projects, setProjects] = useState(activeProjects)
    const [list, setList] = useState(projects.slice(0, numberOfProjects))
    const [toggle, setToggle] = useState(true)

    const showMoreProjects = () => {
        let i = 0
        let l = []

        for (i; i < list.length + numberOfProjects / 2 ; i++) {
            // for (i; i < list.length + numberOfProjects ; i++) {
            if (i < projects.length) {
                l.push(projects[i])
            }
        }
        setList(l)
        if (l.length >= projects.length) {
            setToggle(false)
        }
    }
    const showLessProjects = () => {
        let l = []
        if (list.length > numberOfProjects) {
            l = list.slice(0, list.length - numberOfProjects / 2)
            // l = list.slice(0, list.length - numberOfProjects )
            setList(l)
        }
        if (l.length === numberOfProjects) {
            setToggle(true)
        }
    }

    return (
        <StyledProjects id="projects" className={roboto_mono.variable}>
            <h1 className={roboto.variable}>Projects.</h1>
            <div className="projects-list">
                {list.map((project, idx) => (
                    <ProjectCard project={project} key={idx} />
                ))}
            </div>
            {toggle && (
                <StyledButton
                    className={fira_code.variable + ' showBtn'}
                    as="a"
                    width={180}
                    onClick={showMoreProjects}
                >
                    Show More <BiListPlus />
                </StyledButton>
            )}
            {!toggle && (
                <StyledButton
                    className={fira_code.variable + ' showBtn'}
                    as="a"
                    width={180}
                    onClick={showLessProjects}
                >
                    Show Less
                    <BiListMinus />
                </StyledButton>
            )}
        </StyledProjects>
    )
}
