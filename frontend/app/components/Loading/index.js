import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  CircularProgress,
} from 'material-ui';

import messages from './messages';

const styles = () => ({
  wrapper: {
    textAlign: 'center',
  },
  progress: {},
});

class Loading extends React.PureComponent {
  render() {
    const { classes } = this.props;
    const { error, pastDelay } = this.props;

    if (error) {
      return (
        <div>
          <FormattedMessage {...messages.error} />
        </div>
      );
    }
    if (pastDelay) {
      return (
        <div className={classes.wrapper}>
          <FormattedMessage {...messages.loading} />
          <br />
          <CircularProgress className={classes.progress} />
        </div>
      );
    }
    return null;
  }
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.object,
  pastDelay: PropTypes.bool,
};

export const styledLoading = withStyles(styles)(Loading);

export default styledLoading;
