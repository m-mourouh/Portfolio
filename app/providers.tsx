"use client"
import { ThemeProvider } from "styled-components"
import { theme } from "@/styles/styled-components/Theme"


export const Provider = ( { children }: { children : React.ReactNode}) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
