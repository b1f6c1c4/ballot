import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import injectSaga from 'utils/injectSaga';

import { Switch, Route } from 'react-router-dom';
import GlobalPage from 'components/GlobalPage/Loadable';
import NotFoundPage from 'components/NotFoundPage/Loadable';
import HomeContainer from 'containers/HomeContainer/Loadable';
import LoginContainer from 'containers/LoginContainer/Loadable';
import StatusContainer from 'containers/StatusContainer/Loadable';

import {
  makeSelectGlobalContainerListBallots,
} from './selectors';
import * as globalContainerActions from './actions';
import sagas from './sagas';

const ConnectedSwitch = connect(createStructuredSelector({
  location: createSelector(
    (state) => state.getIn(['route', 'location']),
    (state) => state.toJS(),
  ),
}))(Switch);

export class GlobalContainer extends React.PureComponent {
  render() {
    return (
      <GlobalPage {...this.props}>
        <ConnectedSwitch>
          <Route exact path="/app/" component={HomeContainer} />
          <Route exact path="/app/login" component={LoginContainer} />
          <Route exact path="/app/status" component={StatusContainer} />
          <Route component={NotFoundPage} />
        </ConnectedSwitch>
      </GlobalPage>
    );
  }
}

GlobalContainer.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  isAccountOpen: PropTypes.bool.isRequired,
  onPush: PropTypes.func.isRequired,
  username: PropTypes.string,
  listBallots: PropTypes.array,
  onOpenDrawerAction: PropTypes.func.isRequired,
  onCloseDrawerAction: PropTypes.func.isRequired,
  onOpenAccountAction: PropTypes.func.isRequired,
  onCloseAccountAction: PropTypes.func.isRequired,
  onLoginAction: PropTypes.func.isRequired,
  onLogoutAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onPush: (url) => dispatch(push(url)),
    onOpenDrawerAction: () => dispatch(globalContainerActions.openDrawer()),
    onCloseDrawerAction: () => dispatch(globalContainerActions.closeDrawer()),
    onOpenAccountAction: () => dispatch(globalContainerActions.openAccount()),
    onCloseAccountAction: () => dispatch(globalContainerActions.closeAccount()),
    onLoginAction: () => dispatch(globalContainerActions.login()),
    onLogoutAction: () => dispatch(globalContainerActions.logout()),
  };
}

const mapStateToProps = createStructuredSelector({
  isDrawerOpen: (state) => state.getIn(['globalContainer', 'isDrawerOpen']),
  isAccountOpen: (state) => state.getIn(['globalContainer', 'isAccountOpen']),
  username: (state) => state.getIn(['globalContainer', 'credential', 'username']),
  listBallots: makeSelectGlobalContainerListBallots(),
});

export default compose(
  injectSaga({ key: 'loginContainer', saga: sagas }),
  connect(mapStateToProps, mapDispatchToProps),
)(GlobalContainer);