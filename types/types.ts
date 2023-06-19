export type ProjectType = {
    name: string
    description: string
    stack: string[]
    links: { github: string; website: string }
    image: string
}
export type EmailType = {
    firstName: string
    lastName: string
    message: string
    email: string
}

export type NotificationType = {
    message: string
}