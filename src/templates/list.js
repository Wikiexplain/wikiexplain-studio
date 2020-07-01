import React from "react"
import { graphql, navigate } from "gatsby"
import styled from "styled-components"
import { useLocalJsonForm } from "gatsby-tinacms-json"

import {
  Paper,
  Meta,
  MetaSpan,
  MetaActions,
  DraftBadge,
} from "../components/style"
import { Link } from "gatsby"
import { PageLayout } from "../components/pageLayout"
import { isLoggedIn, getUser } from "../utils/auth"

export default function List({ data, pageContext }) {
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
  if (user) {
    email = user.email;
  }
  const emails = ['example-article@wikiexplain.com', email]
  const posts = data.posts.edges.filter(f => emails.includes(f.node.frontmatter.email))
  return (
    <PageLayout page={page}>
      <>
        {posts &&
          posts.map(item => {
            return (
              <Paper article key={item.node.id}>
                {item.node.frontmatter.draft && <DraftBadge>Draft</DraftBadge>}
                <h2>
                  <Link to={item.node.frontmatter.path}>
                    {item.node.frontmatter.title}
                  </Link>
                </h2>
                <p>{item.node.excerpt}</p>
                <Meta>
                  <MetaSpan>{item.node.frontmatter.date}</MetaSpan>
                  <MetaActions>
                    <Link to={item.node.frontmatter.path}>Read Article →</Link>
                  </MetaActions>
                </Meta>
              </Paper>
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
            date(formatString: "MMMM DD, YYYY")
            path
            title
            draft
            email
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
