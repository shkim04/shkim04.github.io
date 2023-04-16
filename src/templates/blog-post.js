import * as React from "react"
import {  Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Seo from "../components/seo"

const BlogPostTemplate = ({
  data: { previous, next, markdownRemark: post }, 
  pageContext: { locale }
}) => {
  return (
    <>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio locale={locale} />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  )
}

export const Head = ({ data: { markdownRemark: post }, pageContext: { locale } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      locale={locale}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
    $locale: String
    $dateFormat: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(
      id: { eq: $id }
      fields: { locale: { eq: $locale } }
    ) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: $dateFormat)
        description
        tag
      }
      fields {
        locale
      }
    }
    previous: markdownRemark(
      id: { eq: $previousPostId }
      fields: { locale: { eq: $locale } }
    ) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(
      id: { eq: $nextPostId }
      fields: { locale: { eq: $locale } }
    ) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`