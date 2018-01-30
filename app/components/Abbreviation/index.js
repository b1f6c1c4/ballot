import React from 'react';
import PropTypes from 'prop-types';

import {
  withStyles,
} from 'material-ui';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  pre: {
    fontFamily: 'monospace',
    whiteSpace: 'pre',
  },
});

class Abbreviation extends React.PureComponent {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes, text, length } = this.props;

    return (
      <span>
        <span className={classes.pre}>{text.substr(0, length)}</span>
        {text.length > length && '...'}
      </span>
    );
  }
}

Abbreviation.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string,
  length: PropTypes.number,
};

Abbreviation.defaultProps = {
  length: 8,
};

export const styledAbbreviation = withStyles(styles)(Abbreviation);

export default styledAbbreviation;
