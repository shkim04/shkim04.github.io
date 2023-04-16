/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import siteMetaData from '../../config/siteMetadata'

import * as React from "react"

const Seo = ({ description, title, locale, children }) => {

  const metaDescription = description || siteMetaData[locale].description
  const defaultTitle = siteMetaData[locale]?.title

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="medium:card" content="summary" />
      <meta
        name="meidum:creator"
        content={siteMetaData[locale]?.social?.medium || ``}
      />
      <meta name="medium:title" content={title} />
      <meta name="medium:description" content={metaDescription} />
      {children}
    </>
  )
}

export default Seo
