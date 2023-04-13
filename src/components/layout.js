import React, { useEffect } from "react"

import LanguageSwitcher from "./languageSwitcher"
import Title from "./title"

import { useLocale } from "../hooks/locale"
import langMenu from "../../config/i18n"

import { isHomePath, isNotFound } from "../utils/gatsby-node-helpers"

const Layout = ({ location, pageContext: { locale, isDefaultLang, titleByLang }, children }) => {
  // const rootPath = `${__PATH_PREFIX__}/`
  const url = location.pathname
  const isHome = isHomePath(url, locale)

  const { changeLocale } = useLocale()
  useEffect(() => {
    changeLocale(locale)
  }, [locale, changeLocale])

  if(isNotFound(url)) {
    return (
      <div className="global-wrapper" data-is-root-path={isHome}>
        {children}
      </div>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isHome}>
      <header className="global-header">
        <LanguageSwitcher 
          langsConfig={Object.entries(langMenu)}
          locale={locale}
          titleByLang={titleByLang}
          isHome={isHome}
        />
        <div className="global-header-message">
          <Title 
            isHome={isHome}
            isDefaultLang={isDefaultLang}
            locale={locale}
          />
        </div>
        
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a> by Seunghyun Kim
      </footer>
    </div>
  )
}

export default Layout
