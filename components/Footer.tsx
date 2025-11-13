'use client'
import { StyledFooter } from '@/styles/styled-components/Footer.styled'
import data from '@/data/user.json'
import profilesData from '@/data/profiles.json'
import Profiles from './Profiles'
import { roboto_mono } from '@/fonts/fonts'
import Link from 'next/link'
import { BsBalloonHeart } from 'react-icons/bs'
import Share from './Share'
import { useLanguage } from '@/contexts/LanguageContext'
export default function Footer() {
    const { t } = useLanguage()
    return (
        <StyledFooter className={roboto_mono.variable}>
            <Share orientation={"horizontal"}/>
            <Profiles option={true} />
            <p>
                <Link href={profilesData.data.github} target="_blank">
                    {t('footer.madeWith')} <BsBalloonHeart className="icon" /> {t('footer.by')}{' '}
                    {t('footer.name')}
                </Link>
            </p>
        </StyledFooter>
    )
}
