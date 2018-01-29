import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
} from 'material-ui';

import messages from 'messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  resultWrapper: {
    textAlign: 'center',
  },
});

class ResultIndicator extends React.PureComponent {
  formatErrors = (error) => {
    if (!error) return null;

    const arr = [];
    let flag = true;

    if (!error.codes) {
      flag = false;
      arr.push(<FormattedMessage {...messages.unknownError} />);
    } else {
      error.codes.forEach((o) => {
        const idx = `error_${o}`;
        if (messages[idx]) {
          arr.push(<FormattedMessage {...messages[idx]} />);
        } else {
          flag = false;
        }
      });
    }
    if (!flag) {
      arr.push(error.message);
    }

    return arr.filter((a) => a !== null).map((a) => (
      <Typography color="error">
        {a}
      </Typography>
    ));
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes, error } = this.props;

    return (
      <div className={classes.resultWrapper}>
        {this.formatErrors(error)}
      </div>
    );
  }
}

ResultIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.object,
};

export const styledResultIndicator = withStyles(styles)(ResultIndicator);

export default styledResultIndicator;
