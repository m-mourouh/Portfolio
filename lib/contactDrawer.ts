// Tiny event bus so any button (Header, NavBar, hero...) can open the contact
// popup, even from outside the component tree that renders it.
const EVENT = 'portfolio:open-contact'

export const openContactDrawer = () => {
    window.dispatchEvent(new CustomEvent(EVENT))
}

export const onOpenContactDrawer = (handler: () => void) => {
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
}
