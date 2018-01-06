import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import { Switch, Route } from 'react-router-dom';
import HomePage from 'containers/HomePage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import StatusPage from 'containers/StatusPage/Loadable';

import {
  withStyles,
  Typography,
  Button,
} from 'material-ui';

import * as globalActions from './actions';
import messages from './messages';

const styles = (theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
  },
});

const ConnectedSwitch = connect(/* istanbul ignore next */ (state) => ({
  location: state.get('route').get('location').toJS(),
}))(Switch);

class Global extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.content}>
        <FormattedMessage {...messages.header} />
        <Typography>{this.props.hasCredential.toString()}</Typography>
        <Typography>{this.props.isDrawerOpen.toString()}</Typography>
        <Button onClick={this.props.onToggleDrawerOpenAction}>ToggleDrawerOpenAction</Button>
        <ConnectedSwitch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/status" component={StatusPage} />
          <Route component={NotFoundPage} />
        </ConnectedSwitch>
      </div>
    );
  }
}

Global.propTypes = {
  classes: PropTypes.object.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  hasCredential: PropTypes.bool.isRequired,
  onToggleDrawerOpenAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onToggleDrawerOpenAction: () => dispatch(globalActions.toggleDrawerOpen()),
  };
}

const mapStateToProps = createStructuredSelector({
  isDrawerOpen: /* istanbul ignore next */ (state) => state.get('global').get('isDrawerOpen'),
  hasCredential: /* istanbul ignore next */ (state) => !!state.get('global').get('credential'),
});

export const styledGlobal = withStyles(styles, { withTheme: true })(Global);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(styledGlobal);
