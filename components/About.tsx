import { StyledAbout } from '@/styles/styled-components/About.styled'
import data from '@/data/user.json'
import Image from 'next/image'
import Picture from '@/public/images/MOHAMED_MOUROUH.jpg'
import OutlinedPicture from '@/public/images/giphy.webp'
import { roboto_mono, roboto } from '@/fonts/fonts'
import Logo from '@/public/images/logo.svg'

export default function About() {
    function getDescription(): string {
        const name = data.user.name
        // const age = new Date().getFullYear() - +data.user.birth
        const startedAt = data.user.startedAt

        const description = data.user.introduction
            .replace('$name.', name)
            // .replace('$age', age.toString())
            .replace('$year', startedAt.toString())

        return description
    }

    return (
        <StyledAbout className="about" id="about">
            <div className="about__left-col">
                <h1 className={roboto.variable}>About me.</h1>
                <p className={roboto_mono.variable}>{getDescription()}</p>
                <p className={roboto_mono.variable}>{data.user.thank}</p>
            </div>
            <div className="about__right-col">
                <Image src={Logo} alt={data.user.name} className="icon" quality={100} />
                <Image
                    src={Picture}
                    alt={data.user.name}
                    className="real-picture"
                    loading="lazy"
                />
            </div>
        </StyledAbout>
    )
}
