import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
import LoginContainer from 'containers/LoginContainer/Loadable';
import StatusContainer from 'containers/StatusContainer/Loadable';

import {
  withStyles,
} from 'material-ui';

import messages from './messages';

const styles = (theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
  },
});

class HomeContainer extends React.PureComponent {
  /* istanbul ignore next */
  onMouseOverLogin() {
    LoginContainer.preload();
  }

  /* istanbul ignore next */
  onMouseOverStatus() {
    StatusContainer.preload();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.content}>
        <FormattedMessage {...messages.header} />
        <Link to="/app/login" onMouseOver={this.onMouseOverLogin}>login</Link>
        <Link to="/app/status" onMouseOver={this.onMouseOverStatus}>check status</Link>
      </div>
    );
  }
}

HomeContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};


export const styledHomeContainer = withStyles(styles, { withTheme: true })(HomeContainer);

export default compose(
  connect(null, null),
)(styledHomeContainer);
