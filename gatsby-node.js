/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const locales = require(`./config/i18n`)
const {
  // isHomePath,
  localizedSlug,
  findKey,
  removeTrailingSlash,
} = require(`./src/utils/gatsby-node-helpers`)
const blogTitle = require(`./config/blogTitle`)

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.js`)

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  deletePage(page)
  
  Object.keys(locales).map(lang => {
    const localizedPath = locales[lang].default
      ? page.path
      : `${locales[lang].path}${page.path}`
    
    return createPage({
      ...page,
      path: removeTrailingSlash(localizedPath),
      context: {
        ...page.context,
        locale: lang,
        isDefaultLang: locales[lang].default,
        titleByLang: {},
        dateFormat: locales[lang].dateFormat
      }
    })
  })
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const postTitleInfo = createFilePath({ node, getNode }).split(".")
    
    const order = postTitleInfo[0].match(/^\/([0-9]+)/)[1]
    const slug = postTitleInfo[0].replace(/^\/([0-9]+)/, "")
    const lang = postTitleInfo[1].replace("/", "")
    const defaultKey = findKey(locales, o => o.default === true)
    const isDefaultLang = lang === defaultKey
    const titleByLang = blogTitle[order]
    
    createNodeField({ node, name: `slug`, value: localizedSlug({isDefaultLang: isDefaultLang, locale: lang, slug: slug}) })
    createNodeField({ node, name: `locale`, value: lang })
    createNodeField({ node, name: `isDefaultLang`, value: isDefaultLang })
    createNodeField({ node, name: `titleByLang`, value: titleByLang })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
            locale
            isDefaultLang
            titleByLang {
              ko
              en
            }
          }
        }
      }
    }
  `)
  
  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes
  
  // Create blog posts pages
  // But only if there's at least one markdown file found at "blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL
  // const numSupportedLang = 2
  if (posts.length > 0) {
    posts.forEach((post, index) => {
      // const previousPostId = index === 0 || index === 1 ? null : posts[index - numSupportedLang].id
      // const nextPostId = index === posts.length - 1 || index === posts.length - numSupportedLang ? null : posts[index + numSupportedLang].id

      const isDefaultLang = post.fields.isDefaultLang
      const locale = post.fields.locale
      const slug = post.fields.slug
      const titleByLang = post.fields.titleByLang
      const dateFormat = locales[locale].dateFormat

      createPage({
        path: slug,
        component: blogPost,
        context: {
          locale: locale,
          isDefaultLang: isDefaultLang,
          slug: slug,
          titleByLang: titleByLang,
          dateFormat: dateFormat,
          id: post.id,
          // previousPostId,
          // nextPostId,
        },
      })
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      linkedin: String
      medium: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      tag: [String]
      date: Date @dateformat
    }

    type Fields {
      slug: String
      locale: String
      isDefaultLang: Boolean
      titleByLang: TitleByLang
    }

    type TitleByLang {
      ko: String
      en: String
    }
  `)
}
