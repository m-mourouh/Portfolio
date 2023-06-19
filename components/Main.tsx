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
export default function Main() {
    return (
        <StyledMain>
            
            <Head />
            <About />
            <Skills />
            <Projects numberOfProjects={8} />
            <Profiles option={false} />
            <Share orientation='vertical'/>
            <Contact />
            <Footer />
            <Loader/>
            <Cursor/>
        </StyledMain>
    )
}
