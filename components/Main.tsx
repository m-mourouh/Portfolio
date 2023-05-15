import { StyledMain } from '@/styles/styled-components/Main.styled'
import Head from './Head'
import About from './About'
import Skills from './Skills'
export default function Main() {
  return (
      <StyledMain>
          <Head />
          <About/>
          <Skills/>
      </StyledMain>
  )
}
