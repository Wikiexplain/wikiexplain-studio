import React, { useState, useContext, useEffect } from 'react';
import Disqus from 'disqus-react';
import PropTypes from 'prop-types';
import ThemeContext from '../../context';
import config from '../../../config/siteConfig';

class DisqusIndex extends React.Component {
  static contextType = ThemeContext
  state = {
    render: true,
  };
  shouldComponentUpdate() {
    if (this.state.render) {
      return true;
    } else {
      return false;
    }
  }
  componentDidUpdate() {
    this.setState({render: false});
  }
  render() {
    const themeContext = this.context;
    const { slug, title } = this.props;
    const { disqusShortname } = config;
    const disqusConfig = {
      url: `${config.siteUrl + config.pathPrefix + slug}`,
      identifier: title,
      title,
    };
    return (
      <Disqus.DiscussionEmbed theme={themeContext.theme} shortname={disqusShortname} config={disqusConfig} />
    );
  }
}
DisqusIndex.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default DisqusIndex;
