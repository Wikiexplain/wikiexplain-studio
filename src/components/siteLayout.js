import React, { useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled, { css } from "styled-components"
import { Header } from "./header"
import { Footer } from "./footer"
import { Theme } from "./theme"
import Helmet from "react-helmet"
import slugify from "react-slugify"
import { getUser } from "../utils/auth"
import './site-layout.css'

import { createRemarkButton } from "gatsby-tinacms-remark"
import { JsonCreatorPlugin } from "gatsby-tinacms-json"
import { withPlugin } from "tinacms"

let email
const user = getUser();
if (user) {
  email = user.email;
}
const MasterLayout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query MasterLayoutQuery {
      site: settingsJson(
        fileRelativePath: { eq: "/content/settings/site.json" }
      ) {
        title
      }
    }
  `)

  useEffect(() => {
    const plusAddPost = document.getElementsByClassName('ModalOverlay-sc-1pd6lc5')
  }, [])

  return (
    <>
      <Helmet>
        <script src="https://cdn.jsdelivr.net/npm/focus-visible@5.0.2/dist/focus-visible.min.js"></script>
      </Helmet>
      <Theme>
        <Site>
          <Header siteTitle={data.site.title} createPostButton={CreatePostButton}/>
          {children}
          <Footer />
        </Site>
      </Theme>
    </>
  )
}


const CreatePostButton = createRemarkButton({
  label: "Create",
  filename(form) {
    let slug = slugify(form.title.toLowerCase())
    return `content/posts/${slug}.md`
  },
  frontmatter(form) {
    let slug = slugify(form.title.toLowerCase())
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: form.title,
          date: new Date(),
          type: "post",
          path: `/blog/${slug}`,
          email: email,
          author: form.author,
          category: form.category,
          draft: true,
          hero: {
            image: '../images/placeholder.jpg',
            large: false,
            overlay: false,
          }
        })
      }, 1000)
    })
  },
  body({ title }) {
    return `## ${title}`
  },
  fields: [
    { name: "title", label: "Title", component: "text", required: true },
    { name: "author", label: "Author", component: "text", required: true },
    { name: "category", label: "Category", component: "text", placeholder: "social media, algorithms, dance, STEM", required: true }
  ],
})

const CreatePageButton = new JsonCreatorPlugin({
  label: "New Page",
  filename(form) {
    let slug = slugify(form.title.toLowerCase())
    return `content/pages/${slug}.json`
  },
  fields: [
    { name: "title", label: "Title", component: "text", required: true },
    { name: "path", label: "Path", component: "text", required: true },
  ],
  data(form) {
    return {
      title: form.title,
      path: form.path,
    }
  },
})

export default withPlugin(MasterLayout, [CreatePostButton])

export const Site = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;

  > ${Header} {
    flex: 0 0 auto;
  }

  > ${Footer} {
    flex: 0 0 auto;
  }

  > * {
    flex: 1 0 auto;
  }
  ${props =>
    props.theme.hero.parallax &&
    css`
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
      perspective: 1px;
      perspective-origin: top;
      scrollbar-width: none;
      -ms-overflow-style: none;

      ::-webkit-scrollbar {
        display: none;
      }
    `}
`
