import React from "react"
import { Link } from "gatsby"

import siteMetadata from "../../config/siteMetadata";

const Title = ({ isHome, isNotFound, isDefaultLang, locale }) => {
  if(isNotFound) return null
  const title = siteMetadata[locale].title
  let header
  let toPath = isDefaultLang ? "/" : `/${locale}`
  if (isHome) {
    header = (
      <h1 className="main-heading">
        <Link to={toPath}>{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to={toPath}>
        {title}
      </Link>
    )
  }

  return header
};

export default Title;