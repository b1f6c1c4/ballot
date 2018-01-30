import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
} from 'material-ui';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  default: {
    display: 'inline-block',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    borderRadius: theme.spacing.unit / 2,
  },
  unknown: {
    backgroundColor: '#3e2723',
    color: '#fff',
  },
  creating: {
    backgroundColor: '#cddc39',
    color: '#000',
  },
  inviting: {
    backgroundColor: '#ffc107',
    color: '#000',
  },
  invited: {
    backgroundColor: '#9C27B0',
    color: '#fff',
  },
  preVoting: {
    backgroundColor: '#2196F3',
    color: '#fff',
  },
  voting: {
    backgroundColor: '#ff5722',
    color: '#fff',
  },
  finished: {
    backgroundColor: '#607D8B',
    color: '#fff',
  },
});

class StatusBadge extends React.PureComponent {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes, status } = this.props;

    if (!messages[status]) {
      return (
        <div className={[classes.default, classes.unknown].join(' ')}>
          <FormattedMessage {...messages.unknown} />
        </div>
      );
    }

    return (
      <div className={[classes.default, classes[status]].join(' ')}>
        <FormattedMessage {...messages[status]} />
      </div>
    );
  }
}

StatusBadge.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string,
};

export const styledStatusBadge = withStyles(styles)(StatusBadge);

export default styledStatusBadge;
