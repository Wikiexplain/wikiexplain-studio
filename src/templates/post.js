import React from "react"
import { graphql } from "gatsby"
import {
  Paper,
  Meta,
  MetaSpan,
  MetaActions,
  DraftBadge,
} from "../components/style"
import { EditToggle } from "../components/editToggle"
import { Link } from "gatsby"
import { PageLayout } from "../components/pageLayout"
import { useLocalRemarkForm, DeleteAction } from "gatsby-tinacms-remark"
import {
  InlineForm,
  InlineTextField,
  InlineWysiwyg,
} from "react-tinacms-inline"

import { navigate } from "gatsby"
import { isLoggedIn, getUser } from "../utils/auth"

function Post(props) {
  const page = props.data.markdownRemark
  const formOptions = {
    actions: [DeleteAction],
    fields: [
      {
        label: "Title",
        name: "rawFrontmatter.title",
        component: "text",
      },
      {
        label: "Author",
        name: "rawFrontmatter.author",
        component: "text",
      },
      {
        label: "Category",
        name: "rawFrontmatter.category",
        component: "text",
      },
      {
        name: "rawFrontmatter.draft",
        component: "toggle",
        label: "Draft",
      },
      {
        label: "Date",
        name: "rawFrontmatter.date",
        component: "date",
      },
      {
        label: "Tags",
        component: 'tags',
        name: "rawFrontmatter.tags",
        description: "List all the areas mention in your article"
      },
      {
        label: "Cover Image",
        name: "rawFrontmatter.hero.image",
        component: "image",
        parse: (filename) => `../images/${filename}`,
        uploadDir: () => `/content/images/`,
        previewSrc: (formValues) => {
          if (
            !formValues.frontmatter.hero ||
            !formValues.frontmatter.hero.image
          )
            return ""
          return formValues.frontmatter.hero.image.childImageSharp.fluid.src
        },
      },
    ],
  }

  const [data, form] = useLocalRemarkForm(page, formOptions)
  if (!isLoggedIn()) {
    // If we’re not logged in, redirect to the home page.
    if (window) navigate(`/app/login`, { replace: true })
    return null
  }
  const user = getUser();
  const { email } = user;
  const emails = ['example-article@wikiexplain.com', email]
  if (!emails.includes(data.frontmatter.email)) {
    return null
  }
  let editToggle = null
  if (data.frontmatter.title === 'example-article' && email === "neybapps@gmail.com") {
    editToggle = <EditToggle />
  } else {
    editToggle = <EditToggle />
  }
  return (
    <InlineForm form={form}>
      <PageLayout page={data}>
        <Paper>
          <Meta>
            <MetaSpan>{data.frontmatter.date}</MetaSpan>
            <MetaActions>
              <Link to="/blog">← Back to Blog</Link>
            </MetaActions>
          </Meta>
          <h1>
            <InlineTextField name="rawFrontmatter.title" />
          </h1>
          <hr />
          <InlineWysiwyg name="rawMarkdownBody" format="markdown">
            <div
              dangerouslySetInnerHTML={{
                __html: data.html,
              }}
            />
          </InlineWysiwyg>

          {data.frontmatter.draft && <DraftBadge>Draft</DraftBadge>}
          {editToggle}
        </Paper>
      </PageLayout>
    </InlineForm>
  )
}

export default Post

export const postQuery = graphql`
  query($path: String!) {
    markdownRemark(
      published: { eq: true }
      frontmatter: { path: { eq: $path } }
    ) {
      id
      excerpt(pruneLength: 160)
      html

      frontmatter {
        path
        date(formatString: "MMMM DD, YYYY")
        title
        draft
        email
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

      fileRelativePath
      rawFrontmatter
      rawMarkdownBody
    }
  }
`
