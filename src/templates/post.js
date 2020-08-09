import React, { useState } from "react"
import { graphql } from "gatsby"
import {
  Paper,
  Meta,
  MetaSpan,
  MetaActions,
  DraftBadge,
  Image
} from "../components/style"
import loadable from '@loadable/component';
import { EditToggle } from "../components/editToggle"
import { Link } from "gatsby"
import { PageLayout } from "../components/pageLayout"
import { useLocalRemarkForm, DeleteAction } from "gatsby-tinacms-remark"
import {
  InlineForm,
  InlineTextField,
  InlineWysiwyg,
} from "react-tinacms-inline"
import { useIsMobile } from '../utils';
import { navigate } from "gatsby"
import { isLoggedIn, getUser } from "../utils"
import './templates.scss'

function Post(props) {
  const isMobile = useIsMobile();
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
  let [renderDisqus, updateDisqus] = useState(true)
  const refreshDisqus = (flag) => {
    updateDisqus(flag)
  }
  if (!isLoggedIn()) {
    // If we’re not logged in, redirect to the home page.
    if (typeof window !== 'undefined') {
      navigate(`/app/login`, { replace: true })
    }
    return null
  }
  const user = getUser();
  let email
  if (user) {
    email = user.email;
  }
  const emails = ['example-article@wikiexplain.com', email]
  if (!emails.includes(data.frontmatter.email)) {
    return null
  }
  let editToggle = null
  if (data.frontmatter.title === 'example-article' && email === "neybapps@gmail.com") {
    editToggle = <EditToggle refreshDisqus={refreshDisqus}/>
  } else {
    editToggle = <EditToggle refreshDisqus={refreshDisqus}/>
  }
  const Disqus = loadable(() => import('../components/disqus'));
  return (
    <InlineForm form={form}>
      <PageLayout page={data}>
        <Paper className="post-card-text">
          <Meta>
            {!isMobile && data.frontmatter.category && (
              <span className="post-category">{data.frontmatter.category}</span>
            )}
            <MetaActions>
              <Link to="/wiki">← Back to Wiki</Link>
            </MetaActions>
          </Meta>
          <h3 className="post-title">
            <InlineTextField name="rawFrontmatter.title" />
          </h3>
          {isMobile && data.frontmatter.category && (
            <span className="post-category">{data.frontmatter.category}</span>
          )}
          <div className="post-subtitle">
            <span className="subtitle-caption">
              <span className="author">{data.frontmatter.author}</span>
              <span>
                {` • ${data.frontmatter.date}`}
              </span>
            </span>
          </div>
          <ul className="post-tags">
            {data.frontmatter.tags &&
            data.frontmatter.tags.map(tag => (
              <li key={tag}>
                <Link to={`/tags/${tag}`}>{`🔖${tag}`}</Link>
              </li>
            ))}
          </ul>
          <hr className="break-line"/>
          {data.frontmatter.hero.image && <Image fluid={data.frontmatter.hero.image.childImageSharp.fluid} />}
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
        {renderDisqus && <Disqus slug={data.frontmatter.path} title={data.frontmatter.title} /> }
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
        date(formatString: "YYYY-MM-DD")
        title
        draft
        email
        category
        author
        tags
        hero {
          large
          overlay
          image {
            childImageSharp {
              fluid(maxWidth: 800, maxHeight: 400) {
                ...GatsbyImageSharpFluid
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
