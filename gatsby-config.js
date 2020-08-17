require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const theme = require("./content/settings/theme.json")
const site = require("./content/settings/site.json")
module.exports = {
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-tinacms-json`,
    `gatsby-plugin-sass`,
    `gatsby-transformer-json`,
    {
      resolve: "gatsby-plugin-tinacms",
      options: {
        sidebar: {
          hidden: true,
          position: "displace",
          theme: {  
            color: {
              primary: {
                light: theme.color.primary,
                medium: theme.color.primary,
                dark: theme.color.primary,
              },
            },
          },
        },
        plugins: [
          {
            resolve: "gatsby-tinacms-git",
            options: {
              gitRemote:
                "git@github.com:Wikiexplain/wikiexplain-studio.git",
              defaultCommitMessage: "Edited with Cloud Editor",
              defaultCommitName: "Cloud Edit Post",
              defaultCommitEmail: "wikiexplainllc@gmail.com",
            },
          },
          "gatsby-tinacms-remark",
          "gatsby-tinacms-json",
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/images`,
        name: `uploads`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/siteLayout.js`),
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: site.title,
        short_name: site.title,
        start_url: `/`,
        background_color: theme.color.primary,
        theme_color: theme.color.primary,
        display: `minimal-ui`,
        icon: `content/images/icon.jpg`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
            options: {
              name: "uploads",
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 880,
              withWebp: true,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static",
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: true,
              noInlineHighlight: false,
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Lato:400,700"],
        },
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] }
    },
    {  
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,  
      options: {  
        // Fields to index  
        fields: [`title`, `tags`, `html`],  
        resolvers: {  
          MarkdownRemark: {  
            title: node => node.frontmatter.title,
            email: node => node.frontmatter.email, 
            tags: node => node.frontmatter.tags,  
            path: node => node.frontmatter.path,  
            html: node => node.internal.content, 
          },  
        },  
      },  
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyBnahAiRVCVBCYkL078Q5wPhb-T95Ytrv4",
          authDomain: "wikiexplain-studio-bc629.firebaseapp.com",
          databaseURL: "https://wikiexplain-studio-bc629.firebaseio.com",
          projectId: "wikiexplain-studio-bc629",
          storageBucket: "wikiexplain-studio-bc629.appspot.com",
          messagingSenderId: "634340298274",
          appId: "1:634340298274:web:4f7150f596057102c9447b",
          measurementId: "G-YRG5759374"
        }
      }
    }
  ],
}
