import * as React from "react"

import Seo from "../components/seo"

const NotFoundPage = () => {

  return (
    <>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist.</p>
    </>
  )
}

export const Head = ({ pageContext: { locale } }) => <Seo title="404: Not Found" locale={locale} />

export default NotFoundPage
