import React from "react"
import { Link } from "gatsby"

const LanguageSwitcher = ({ langsConfig, locale, titleByLang, isHome }) => {
  const langsMenu = langsConfig.map((lang, index) => {
    const toPath = isHome ? lang[1].path : lang[1].default ? `/${titleByLang[lang[1].siteLanguage]}` : `${lang[1].path}/${titleByLang[lang[1].siteLanguage]}`
    
    return (
      <li 
        key={lang[1].locale}
        className={index === langsConfig.length - 1 ? `language-item last-item` : `language-item`}
      >
        <Link 
          to={toPath}
          className={locale === lang[1].siteLanguage ? `active-langauge` : ``}
        >
          {lang[1].text}
        </Link>
      </li>
    )
  })

  return (
    <nav className="language-nav">
      <ul className="language-item-container">
        {langsMenu}
      </ul>
    </nav>
  );
};

export default LanguageSwitcher;