import React from 'react'
import { LocaleProvider } from './src/hooks/locale'
import Layout from './src/components/layout'

// Pass all props (hence the ...props) to the layout component so it has access to things like pageContext or location
const wrapPageElement = ({ element, props }) => (
  <LocaleProvider>
    <Layout {...props}>{element}</Layout>
  </LocaleProvider>
);

export default wrapPageElement;