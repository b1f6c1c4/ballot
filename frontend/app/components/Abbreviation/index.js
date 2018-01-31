import React from 'react';
import PropTypes from 'prop-types';

import {
  withStyles,
} from 'material-ui';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  root: {
    display: 'inline',
  },
  pre: {
    whiteSpace: 'pre',
  },
});

class Abbreviation extends React.PureComponent {
  state = { expand: false, expandTime: null };

  handleExpand = () => {
    if (this.state.expand) {
      if (new Date() - this.state.expandTime > 5000) {
        this.handleClose();
      }
    } else {
      if (!this.props.allowExpand) return;
      this.setState({ expand: true, expandTime: new Date() });
    }
  };

  handleClose = () => {
    this.setState({ expand: false, expandTime: null });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes, text, length } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <div
        className={classes.root}
        onClick={this.handleExpand}
        onDoubleClick={this.handleClose}
      >
        {this.state.expand && (
          <span className={classes.pre}>{text}</span>
        )}
        {!this.state.expand && (
          <span className={classes.pre}>
            {text.substr(0, length)}
            {text.length > length && '...'}
          </span>
        )}
      </div>
    );
  }
}

Abbreviation.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string,
  length: PropTypes.number,
  allowExpand: PropTypes.bool,
};

Abbreviation.defaultProps = {
  length: 8,
  allowExpand: false,
};

export const styledAbbreviation = withStyles(styles)(Abbreviation);

export default styledAbbreviation;
