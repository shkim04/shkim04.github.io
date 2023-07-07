import React from "react"
import { Link } from "gatsby"

import siteMetadata from "../../config/siteMetadata"

const Title = ({ isDefaultLang, locale }) => {
  const title = siteMetadata[locale].title
  let toPath = isDefaultLang ? `/` : `/${locale}`
  return (
    <h1 className="main-heading">
      <Link to={toPath}>{title}</Link>
    </h1>
  )
}

export default Title
