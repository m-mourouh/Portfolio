import { StyledMain } from '@/styles/styled-components/Main.styled'
import Head from './Head'
import About from './About'
export default function Main() {
  return (
      <StyledMain>
          <Head />
          <About/>
      </StyledMain>
  )
}
