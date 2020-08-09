import React, { useState, useContext, useEffect } from 'react';
import Disqus from 'disqus-react';
import PropTypes from 'prop-types';
import ThemeContext from '../../context';
import config from '../../../config/siteConfig';

class DisqusIndex extends React.Component {
  render() {
    const { slug, title } = this.props;
    const { disqusShortname } = config;
    const disqusConfig = {
      url: `${config.siteUrl + config.pathPrefix + slug}`,
      identifier: title,
      title,
    };
    return (
      <Disqus.DiscussionEmbed theme={""} shortname={disqusShortname} config={disqusConfig} />
    );
  }
}
DisqusIndex.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default DisqusIndex;
