// Event helpers for the command menu and for opening a project popup from anywhere.
const OPEN_MENU = 'portfolio:open-command-menu'
const OPEN_PROJECT = 'portfolio:open-project'

export const openCommandMenu = () => window.dispatchEvent(new CustomEvent(OPEN_MENU))

export const onOpenCommandMenu = (handler: () => void) => {
    window.addEventListener(OPEN_MENU, handler)
    return () => window.removeEventListener(OPEN_MENU, handler)
}

export const openProject = (name: string) => window.dispatchEvent(new CustomEvent(OPEN_PROJECT, { detail: name }))

export const onOpenProject = (handler: (name: string) => void) => {
    const listener = (e: Event) => handler((e as CustomEvent<string>).detail)
    window.addEventListener(OPEN_PROJECT, listener)
    return () => window.removeEventListener(OPEN_PROJECT, listener)
}
