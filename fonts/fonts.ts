// Using system fonts as fallback due to Google Fonts API timeout issues during build
// These will use the CSS variable names but fallback to system fonts

export const fira_code = {
    variable: '--font-fira-code',
    style: { fontFamily: 'monospace' }
}

export const roboto = {
    variable: '--font-roboto',
    style: { fontFamily: 'system-ui, -apple-system, sans-serif' }
}

export const roboto_mono = {
    variable: '--font-roboto-mono',
    style: { fontFamily: 'monospace' }
}

export const dancing_script = {
    variable: '--font-dancing-script',
    style: { fontFamily: 'cursive' }
}