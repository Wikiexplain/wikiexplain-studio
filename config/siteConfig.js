const config = {
  author: 'WikiExplain LLC', // Site owner
  siteTitle: 'WikiExplain', // Site title.
  siteTitleShort: 'WikiExplain', // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: 'WikiExplain', // Alternative site title for SEO.
  siteLanguage: 'en', // Site language.
  siteDescription: 'WikiExplain where complex topics are made simple. Learn your favorite topics in minutes! You can also summarize anything you are learning or doing and make money with it!', // Website description used for RSS feeds/meta description tag.
  siteLogo: 'static/favicons/favicon.jpg', // Logo used for manifest.
  siteUrl: 'https://wikiexplain.com', // Domain of your website without pathPrefix.
  pathPrefix: '/', // Prefixes all links. For cases when deployed to example.github.io/gatsby-material-starter/.
  siteRss: '/rss.xml', // Path to the RSS file.
  siteFBAppID: '2881278058637798', // FB Application ID for using app insights
  siteGATrackingID: 'UA-167449709-1', // Tracking code ID for google analytics.
  disqusShortname: 'wikiexplain-com', // Disqus shortname.
  twitterUserName: 'WikiExplain', // twitter creator for SEO
  datePublished: '2020-06-30', // for SEO
  copyrightYear: '2020', // for SEO
  postsPerPage: 4, // posts per page used in gatsby-node.js
  rrssb: [
    {
      label: 'github',
      url: 'https://github.com/neybapps',
      iconClassName: 'fab fa-github',
    },
    {
      label: 'mail',
      url: 'mailto:wikiexplainllc@gmail.com',
      iconClassName: 'fa fa-envelope',
    },
    {
      label: 'twitter',
      url: 'https://twitter.com/WikiExplain',
      iconClassName: 'fab fa-twitter',
    },
    {
      label: 'facebook',
      url: 'https://www.facebook.com/wikistudio.plain.3',
      iconClassName: 'fab fa-facebook',
    },
  ],
  // Links to pages you want to display in the navigation bar.
  navbarLinks: [
    {
      label: 'Categories',
      url: '/categories',
      iconClassName: 'fa fa-list-alt',
    },
    {
      label: 'Archives',
      url: '/archives',
      iconClassName: 'fa fa-book-open',
    },
    {
      label: 'About',
      url: '/about',
      iconClassName: 'fa fa-address-card',
    }
  ],
};
config.copyright = `Copyright © ${config.copyrightYear}. ${config.author}`;

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = '';
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`;
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/') config.siteUrl = config.siteUrl.slice(0, -1);

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== '/') config.siteRss = `/${config.siteRss}`;

module.exports = config;
