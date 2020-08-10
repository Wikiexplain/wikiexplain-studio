import React from "react"
import { graphql, navigate } from "gatsby"
import styled from "styled-components"
import { useLocalJsonForm } from "gatsby-tinacms-json"
import { useIsMobile } from '../utils';
import './templates.scss'

import {
  Paper,
  Meta,
  MetaSpan,
  MetaActions,
  DraftBadge,
  Image,
} from "../components/style"
import { Link } from "gatsby"
import { PageLayout } from "../components/pageLayout"
import { isLoggedIn, getUser } from "../utils"


export default function List({ data, pageContext }) {
  const isMobile = useIsMobile();
  const [page] = useLocalJsonForm(data.page, ListForm)

  const { slug, limit, skip, numPages, currentPage } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage =
    currentPage - 1 === 1 ? slug : slug + "/" + (currentPage - 1).toString()
  const nextPage = slug + "/" + (currentPage + 1).toString()
  page.title = isFirst ? page.title : page.title + " - " + currentPage
 

  if (!isLoggedIn()) {
    const url = `/app/login?originSlug=${pageContext.slug}`
    // If we’re not logged in, redirect to the home page.
    if (typeof window !== 'undefined') navigate(url, { replace: true })
    return null
  }

  const user = getUser();

  let email
  if (user) {
    email = user.email;
  }
  const emails = ['example-article@wikiexplain.com', email]
  const posts = data.posts.edges.filter(f => emails.includes(f.node.frontmatter.email))
  return (
    <PageLayout page={page}>
      <>
        {posts &&
          posts.map((item, i) => {
            return (
              <article className="post-card" key={i}>
                 {item.node.frontmatter.hero.image && <Image fluid={{ ...item.node.frontmatter.hero.image.childImageSharp.fluid }} className="post-card-cover" />}
                <Paper article key={item.node.id} className="post-card-text">
                  {!isMobile && item.node.frontmatter.category && (
                      <span className="post-category">{item.node.frontmatter.category}</span>
                  )}
                  {item.node.frontmatter.draft && <DraftBadge className="draft-badge">Draft</DraftBadge>}
                  <h3 className="post-title">
                    <Link to={item.node.frontmatter.path}>
                      {item.node.frontmatter.title}
                    </Link>
                  </h3>
                  {isMobile && item.node.frontmatter.category && (
                      <span className="post-category">{item.node.frontmatter.category}</span>
                  )}
                  <div className="post-subtitle">
                    <span className="subtitle-caption">
                      <span className="author">{item.node.frontmatter.author}</span>
                      <span>
                        {` • ${item.node.frontmatter.date}`}
                      </span>
                    </span>
                  </div>
                  {!isMobile && <p className="content-text">{item.node.excerpt}</p> }
                  {!isMobile && <ul className="post-tags">
                    {item.node.frontmatter.tags &&
                    item.node.frontmatter.tags.map(tag => (
                      <li key={tag}>
                        <Link to={item.node.frontmatter.path}>{`🔖${tag}`}</Link>
                      </li>
                    ))}
                  </ul>}
                </Paper>
              </article>
            )
          })}
        <ListNav>
          {!isFirst && (
            <Link to={prevPage} rel="prev">
              ← Newer
            </Link>
          )}
          {!isLast && (
            <Link to={nextPage} rel="next">
              Older →
            </Link>
          )}
        </ListNav>
      </>
    </PageLayout>
  )
}

export const pageQuery = graphql`
  query($listType: String!, $slug: String!, $skip: Int!, $limit: Int!) {
    page: pagesJson(path: { eq: $slug }) {
      path
      title
      hero {
        headline
        textline
        large
        overlay
        ctas {
          label
          link
          primary
          arrow
        }
        image {
          childImageSharp {
            fluid(quality: 70, maxWidth: 1920) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
      listType
      rawJson
      fileRelativePath
    }
    posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        frontmatter: { type: { eq: $listType } }
        published: { eq: true }
      }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            path
            title
            draft
            email
            author
            category
            tags
            hero {
              large
              overlay
              image {
                childImageSharp {
                  fluid(quality: 70, maxWidth: 1920) {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const ListNav = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;

  a {
    display: inline-block;
    padding: 0.5rem 1rem;
  }
`

const ListForm = {
  label: "Let's create!",
  fields: [],
}
