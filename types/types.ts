export type ProjectType = {
    name: string
    description: string
    stack: string[]
    links: { github: string; website: string }
    image: string
}
export type EmailType = {
    name: string
    company: string
    projectTypes: string[]
    email: string
    message: string
    /** honeypot, always empty for people */
    website: string
}

export type NotificationType = {
    message: string
}