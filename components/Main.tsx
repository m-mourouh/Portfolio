import type { Article } from '@/lib/articles'
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
import GridCrosshair from './GridCrosshair'
import BackgroundMusic from './BackgroundMusic'
import MotionEffects from './MotionEffects'
import DeferredWidgets from './DeferredWidgets'
export default function Main({ articles }: { articles: Article[] }) {
    return (
        <StyledMain id="main" tabIndex={-1}>
            <GridBackground />
            <Head />
            <About />
            <Skills />
            <Projects />
            <Articles articles={articles} />
            <Profiles option={false} />
            <Share orientation='vertical'/>
            <Contact />
            <Footer />
            <Loader/>
            <Cursor/>
            <ClickEffect />
            <GridCrosshair />
            <BackgroundMusic />
            <MotionEffects />
            <DeferredWidgets />
        </StyledMain>
    )
}