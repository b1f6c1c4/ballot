import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import { Switch, Route } from 'react-router-dom';
import HomeContainer from 'containers/HomeContainer/Loadable';
import LoginContainer from 'containers/LoginContainer/Loadable';
import NotFoundContainer from 'containers/NotFoundContainer/Loadable';
import StatusContainer from 'containers/StatusContainer/Loadable';

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

const ConnectedSwitch = connect(createStructuredSelector({
  location: createSelector(
    (state) => state.getIn(['route', 'location']),
    (state) => state.toJS(),
  ),
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
          <Route exact path="/app/" component={HomeContainer} />
          <Route exact path="/app/login" component={LoginContainer} />
          <Route exact path="/app/status" component={StatusContainer} />
          <Route component={NotFoundContainer} />
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
  isDrawerOpen: (state) => state.get('global').get('isDrawerOpen'),
  hasCredential: (state) => !!state.get('global').get('credential'),
});

export const styledGlobal = withStyles(styles, { withTheme: true })(Global);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(styledGlobal);
