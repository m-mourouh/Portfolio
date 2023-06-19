import { StyledFooter } from '@/styles/styled-components/Footer.styled'
import data from '@/data/user.json'
import profilesData from '@/data/profiles.json'
import Profiles from './Profiles'
import { roboto_mono } from '@/fonts/fonts'
import Link from 'next/link'
import { BsBalloonHeart } from 'react-icons/bs'
import Share from './Share'
export default function Footer() {
    return (
        <StyledFooter className={roboto_mono.variable}>
            <Share orientation={"horizontal"}/>
            <Profiles option={true} />
            <p>
                <Link href={profilesData.data.github} target="_blank">
                    Created with <BsBalloonHeart className="icon" /> by{' '}
                    {data.user.name}
                </Link>
            </p>
        </StyledFooter>
    )
}
