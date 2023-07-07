import React, { useEffect } from "react"

import LanguageSwitcher from "./languageSwitcher"
import Title from "./title"
import Bio from "./bio"

import { useLocale } from "../hooks/locale"
import langMenu from "../../config/i18n"

import { isHomePath, isNotFound } from "../utils/gatsby-node-helpers"

const Layout = ({
  location,
  pageContext: { locale, isDefaultLang, titleByLang },
  children,
}) => {
  // const rootPath = `${__PATH_PREFIX__}/`
  const url = location.pathname
  const isHome = isHomePath(url, locale)

  const { changeLocale } = useLocale()
  useEffect(() => {
    changeLocale(locale)
  }, [locale, changeLocale])

  if (isNotFound(url)) {
    return <div className="global-wrapper">{children}</div>
  }

  return (
    <div className="global-wrapper">
      <header className="global-header">
        <LanguageSwitcher
          langsConfig={Object.entries(langMenu)}
          locale={locale}
          titleByLang={titleByLang}
          isHome={isHome}
        />
        <div className="global-header-message">
          <Title isDefaultLang={isDefaultLang} locale={locale} />
        </div>
        <Bio locale={locale} />
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
