'use client'
import Image from 'next/image'
import styled from 'styled-components'
import { FiArrowUpRight, FiClock } from 'react-icons/fi'
import articlesData from '@/data/articles.json'
import { useLanguage } from '@/contexts/LanguageContext'
import { device } from '@/styles/styled-components/Breakpoints'
import { padding, selection } from '@/styles/styled-components/Helpers'

/** "Latest Writing": hand-picked Medium articles from data/articles.json (newest first). */
export default function ArticlesList() {
    const { t, language } = useLanguage()
    const articles = [...articlesData.data].sort((a, b) => b.date.localeCompare(a.date))
    const profileUrl = articlesData.profile
    if (!articles.length) return null
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })

    return (
        <Section id="articles">
            <div className="articles-header">
                <h1 dangerouslySetInnerHTML={{ __html: t('articles.title') }} />
                <a className="all-link" href={profileUrl} target="_blank" rel="noopener noreferrer">
                    {t('articles.viewAll')} <FiArrowUpRight />
                </a>
            </div>
            <div className="articles-grid">
                {articles.map((a) => (
                    <a key={a.url} className="article-card" href={a.url} target="_blank" rel="noopener noreferrer">
                        {a.image && (
                            <div className="cover">
                                <Image src={a.image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                            </div>
                        )}
                        <div className="meta">
                            <span>{formatDate(a.date)}</span>
                            {a.readingTime > 0 && (
                                <span>
                                    <FiClock /> {t('articles.minRead', { count: a.readingTime })}
                                </span>
                            )}
                        </div>
                        <h3 lang="en">{a.title}</h3>
                        <div className="footer">
                            <div className="tags">
                                {a.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            <FiArrowUpRight className="arrow" aria-hidden="true" />
                        </div>
                    </a>
                ))}
            </div>
        </Section>
    )
}

const Section = styled.section`
    ${padding()}
    padding-top: 100px;
    padding-bottom: 60px;
    color: var(--white);
    font-family: var(--font-general-sans);

    @media ${device.sm} {
        padding-top: 70px;
        padding-bottom: 40px;
    }

    .articles-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 20px;
        margin-bottom: 48px;

        @media ${device.sm} {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 32px;
        }

        h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 400;
            line-height: 1.2;
            ${selection(true, '#fff')}

            .secondary-text {
                color: #888;
                font-weight: 300;
            }
        }
    }

    .all-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #c4ff00;
        text-decoration: none;
        font-weight: 500;
        white-space: nowrap;
        padding-bottom: 10px;

        &:hover {
            text-decoration: underline;
            text-underline-offset: 4px;
        }
    }

    .articles-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;

        @media ${device.lg} {
            grid-template-columns: repeat(2, 1fr);
        }
        @media ${device.sm} {
            grid-template-columns: 1fr;
            gap: 16px;
        }
    }

    .article-card {
        display: flex;
        flex-direction: column;
        gap: 18px;
        padding: 0 0 26px;
        overflow: hidden;

        > .meta,
        > h3,
        > .footer {
            padding: 0 26px;
        }

        .cover {
            position: relative;
            aspect-ratio: 16 / 9;
            background: rgb(20, 20, 20);
            overflow: hidden;
            margin-bottom: 4px;

            img {
                object-fit: cover;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
        }
        border-radius: 16px;
        background: rgb(28, 28, 28);
        border: 1px solid rgb(41, 41, 41);
        color: inherit;
        text-decoration: none;
        transition: border-color 0.3s ease, background-color 0.3s ease;

        &:hover,
        &:focus-visible {
            border-color: rgb(70, 70, 70);
            background: rgb(31, 31, 31);
            outline: none;

            .cover img {
                transform: scale(1.05);
            }

            h3 {
                color: #c4ff00;
            }
            .arrow {
                color: #c4ff00;
                transform: translate(2px, -2px);
            }
        }

        .meta {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            color: #777;
            font-size: 0.85rem;

            span {
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
        }

        h3 {
            font-size: 1.25rem;
            font-weight: 500;
            line-height: 1.4;
            flex: 1;
            transition: color 0.3s ease;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            span {
                padding: 4px 10px;
                border-radius: 6px;
                background: rgb(41, 41, 41);
                font-size: 0.75rem;
                color: #999;
            }
        }

        .arrow {
            flex-shrink: 0;
            color: #888;
            font-size: 1.2rem;
            transition: color 0.3s ease, transform 0.3s ease;
        }
    }
`
