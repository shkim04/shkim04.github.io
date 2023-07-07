import React, { useState } from "react"
import { Link, graphql } from "gatsby"

import SetIcons from "../components/setIcons"
import Seo from "../components/seo"

const Index = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const blogTagsList = [
    "Project",
    "NodeJS",
    "React",
    "Python",
    "Database",
    "Linux",
    "Cloud",
  ]

  const [selectedTags, setSelectedTags] = useState([])

  const handleSelectedTag = tag => {
    let copiedSelectedTags = [...selectedTags]
    let resultSelectedTag =
      copiedSelectedTags.indexOf(tag) > -1
        ? copiedSelectedTags.filter(selectedTag => selectedTag !== tag)
        : [...copiedSelectedTags, tag]

    setSelectedTags(resultSelectedTag)
  }

  return (
    <>
      <div className="blog-tag-list-container">
        <div className="tag-filter-message">Filtered By:</div>
        <div className="tag-icon-container">
          {blogTagsList.map((tag, index) => {
            return (
              <button
                className={
                  selectedTags.indexOf(tag) > -1
                    ? "tag-icon active-tag"
                    : "tag-icon"
                }
                key={tag + index}
                onClick={() => handleSelectedTag(tag)}
              >
                <SetIcons iconText={tag} />
                <span>{tag}</span>
              </button>
            )
          })}
        </div>
      </div>
      <ol style={{ listStyle: `none` }}>
        {posts
          .filter(post =>
            selectedTags.length === 0
              ? true
              : post.frontmatter.tag.find(tag => selectedTags.indexOf(tag) > -1)
          )
          .map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <p>
                      {post.frontmatter.tag.map((tag, index) => (
                        <SetIcons key={tag + index} iconText={tag} />
                      ))}
                    </p>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </article>
              </li>
            )
          })}
      </ol>
    </>
  )
}

export default Index

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = ({ pageContext: { locale } }) => (
  <Seo title="Home Page" locale={locale} />
)

export const pageQuery = graphql`
  query Index($locale: String, $dateFormat: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { fields: { locale: { eq: $locale } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        excerpt
        fields {
          slug
          locale
          isDefaultLang
        }
        frontmatter {
          date(formatString: $dateFormat)
          title
          description
          tag
        }
      }
    }
  }
`
