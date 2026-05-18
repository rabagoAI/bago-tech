import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'BagoTech'
const DEFAULT_DESCRIPTION =
    'Descubre los mejores productos tech en Amazon con ofertas exclusivas. Recomendaciones curadas por BagoTech.'

interface SEOProps {
    title: string
    description?: string
    canonical?: string
    noindex?: boolean
}

export const SEO = ({ title, description, canonical, noindex }: SEOProps) => {
    const fullTitle = `${title} | ${SITE_NAME}`
    const desc = description || DEFAULT_DESCRIPTION

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            {noindex && <meta name="robots" content="noindex,nofollow" />}
            {canonical && <link rel="canonical" href={`https://bagotech.com${canonical}`} />}

            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:site_name" content={SITE_NAME} />
            {canonical && <meta property="og:url" content={`https://bagotech.com${canonical}`} />}

            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
        </Helmet>
    )
}
