/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import SocialLinks from "./socialLinks"

import siteMetadata from "../../config/siteMetadata"

const Bio = ({ locale }) => {
  const author = siteMetadata[locale].author

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/profile-pic.png"
        width={150}
        height={150}
        quality={95}
        alt="Profile picture"
      />
      {author?.name && (
        <>
          <p className="bio-summary">{author?.summary || null}</p>
          <br />
          <SocialLinks />
        </>
      )}
    </div>
  )
}

export default Bio
