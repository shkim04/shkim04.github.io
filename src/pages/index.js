import React, { useState } from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Seo from "../components/seo"

const blogTagsList = ["NodeJS", "ReactJS", "NextJS", "Python", "MongoDB", "Linux", "Docker", "Log"]

const Index = ({ data, pageContext: { locale } }) => {
  const posts = data.allMarkdownRemark.nodes
  const [selectedTag, setSelectedTag] = useState("")

  const handleSelectedTag = (tag) => {
    if(tag === selectedTag) {
      setSelectedTag('')
      return
    }
    
    setSelectedTag(tag)
  }

  if (posts.length === 0) {
    return (
      <>
        <Bio locale={locale} />
        <p>
          No blog posts found.
        </p>
      </>
    )
  }

  return (
    <>
      <Bio locale={locale} />
      <div className='blog-tag-list-container'>
        {blogTagsList.map((tag, index) => (
          <button 
            key={tag + index}
            onClick={() => handleSelectedTag(tag)}
            className={tag === selectedTag ? "active-tag" : ""}
          >
            {tag}
          </button>
        ))}
      </div>
      <ol style={{ listStyle: `none` }}>
        {posts
            .filter(post => !selectedTag ? true : selectedTag === post.frontmatter.tag)
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
                      <p><span>{post.frontmatter.tag}</span></p>
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
export const Head = () => <Seo title="Home Page" />

export const pageQuery = graphql`
query Index(
  $locale: String
  $dateFormat: String
) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {
        fields: { locale: { eq: $locale } }
      }
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
