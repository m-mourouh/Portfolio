import { StyledMain } from '@/styles/styled-components/Main.styled'
import Head from './Head'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Contact from './Contact'
import Profiles from './Profiles'
import Footer from './Footer'
import Share from './Share'
import Loader from './Loader'
import Cursor from './Cursor'
import GridBackground from './GridBackground'
import BackgroundMusic from './BackgroundMusic'
export default function Main() {
    return (
        <StyledMain>
            <GridBackground />
            <Head />
            <About />
            <Skills />
            <Projects />
            <Profiles option={false} />
            <Share orientation='vertical'/>
            <Contact />
            <Footer />
            <Loader/>
            <Cursor/>
            <BackgroundMusic />
        </StyledMain>
    )
}