import { StyledMain } from '@/styles/styled-components/Main.styled'
import Head from './Head'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Articles from './ArticlesList'
import Contact from './Contact'
import Profiles from './Profiles'
import Footer from './Footer'
import Share from './Share'
import Loader from './Loader'
import Cursor from './Cursor'
import GridBackground from './GridBackground'
import ClickEffect from './ClickEffect'
import MotionEffects from './MotionEffects'
import ContactDrawer from './ContactDrawer'
import CommandMenu from './CommandMenu'
export default function Main() {
    return (
        <StyledMain>
            <GridBackground />
            <Head />
            <About />
            <Skills />
            <Projects />
            <Articles />
            <Profiles option={false} />
            <Share orientation='vertical'/>
            <Contact />
            <Footer />
            <Loader/>
            <Cursor/>
            <ClickEffect />
            <MotionEffects />
            <ContactDrawer />
            <CommandMenu />
        </StyledMain>
    )
}