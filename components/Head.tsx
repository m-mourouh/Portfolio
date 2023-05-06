import { StyledSelection } from '@/styles/styled-components/Head.styled'
import  data  from '@/data/data.json'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { fira_code, roboto, montserrat, roboto_mono } from '@/fonts/fonts'
import parse from "html-react-parser"
export default function Head() {
    return (
        <StyledSelection>
            <div className="bg"></div>
            <div className="wrapper">
                <p className={fira_code.variable}>{data.user['intro-text']}</p>
                <h1 className={roboto.variable}>
                    <span>{data.user.name.split(' ')[0]} </span>
                    <span>{data.user.name.split(' ')[1]}</span>
                </h1>
                <h5 className={roboto.variable}>{parse(data.user.subtitle)}</h5>
                <p className={roboto_mono.variable}>
                    {parse(data.user.job.description)}
                </p>
                <StyledButton
                    className={fira_code.variable}
                    as="a"
                    href={data.user.social_media.linkedin}
                    target="_blank"
                    width={180}
                >
                    Hire me
                </StyledButton>
            </div>
        </StyledSelection>
    )
}
