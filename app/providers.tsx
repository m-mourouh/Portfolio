"use client"
import { ThemeProvider } from "styled-components"
import { theme } from "@/styles/styled-components/Theme"
import { LanguageProvider } from "@/contexts/LanguageContext"


export const Provider = ( { children }: { children : React.ReactNode}) => {
  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  )
}
