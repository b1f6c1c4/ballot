import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import injectSaga from 'utils/injectSaga';

import { Switch, Route } from 'react-router-dom';
import GlobalPage from 'components/GlobalPage';
import NotFoundPage from 'components/NotFoundPage';
import HomeContainer from 'containers/HomeContainer/Loadable';
import LoginContainer from 'containers/LoginContainer/Loadable';
import ChangePasswordContainer from 'containers/ChangePasswordContainer/Loadable';
import CreateBallotContainer from 'containers/CreateBallotContainer/Loadable';
import ViewBallotContainer from 'containers/ViewBallotContainer/Loadable';
import EditVotersContainer from 'containers/EditVotersContainer/Loadable';
import EditFieldsContainer from 'containers/EditFieldsContainer/Loadable';
import VoterRegContainer from 'containers/VoterRegContainer/Loadable';
import PreVotingContainer from 'containers/PreVotingContainer/Loadable';
import ViewStatContainer from 'containers/ViewStatContainer/Loadable';

import * as languageProviderActions from 'containers/LanguageProvider/actions';
import * as globalContainerSelectors from './selectors';
import * as globalContainerActions from './actions';
import sagas from './sagas';

const ConnectedSwitch = connect(createStructuredSelector({
  location: createSelector(
    (state) => state.getIn(['route', 'location']),
    (state) => state.toJS(),
  ),
}))(Switch);

export class GlobalContainer extends React.PureComponent {
  componentWillMount() {
    this.props.onStatusRequestAction();
  }

  componentWillUnmount() {
    this.props.onStatusStopAction();
  }

  render() {
    return (
      <GlobalPage {...this.props}>
        <ConnectedSwitch>
          <Route exact path="/app/" component={HomeContainer} />
          <Route exact path="/app/login" component={LoginContainer} />
          <Route exact path="/app/password" component={ChangePasswordContainer} />
          <Route exact path="/app/create" component={CreateBallotContainer} />
          <Route exact path="/app/ballots/:bId" component={ViewBallotContainer} />
          <Route exact path="/app/ballots/:bId/voters/" component={EditVotersContainer} />
          <Route exact path="/app/ballots/:bId/fields/" component={EditFieldsContainer} />
          <Route exact path="/app/vreg/:bId/:iCode" component={VoterRegContainer} />
          <Route exact path="/app/ballots/:bId/preVoting" component={PreVotingContainer} />
          <Route exact path="/app/ballots/:bId/tickets/" component={ViewStatContainer} />
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
  onLanguage: PropTypes.func.isRequired,
  username: PropTypes.string,
  listBallots: PropTypes.array,
  onOpenDrawerAction: PropTypes.func.isRequired,
  onCloseDrawerAction: PropTypes.func.isRequired,
  onOpenAccountAction: PropTypes.func.isRequired,
  onCloseAccountAction: PropTypes.func.isRequired,
  onLoginAction: PropTypes.func.isRequired,
  onLogoutAction: PropTypes.func.isRequired,
  onStatusStopAction: PropTypes.func.isRequired,
  onStatusRequestAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onPush: (url) => dispatch(push(url)),
    onLanguage: (lo) => dispatch(languageProviderActions.changeLocale(lo)),
    onOpenDrawerAction: () => dispatch(globalContainerActions.openDrawer()),
    onCloseDrawerAction: () => dispatch(globalContainerActions.closeDrawer()),
    onOpenAccountAction: () => dispatch(globalContainerActions.openAccount()),
    onCloseAccountAction: () => dispatch(globalContainerActions.closeAccount()),
    onLoginAction: () => dispatch(globalContainerActions.login()),
    onLogoutAction: () => dispatch(globalContainerActions.logout()),
    onStatusStopAction: () => dispatch(globalContainerActions.statusStop()),
    onStatusRequestAction: () => dispatch(globalContainerActions.statusRequest()),
  };
}

const mapStateToProps = createStructuredSelector({
  isDrawerOpen: (state) => state.getIn(['globalContainer', 'isDrawerOpen']),
  isAccountOpen: (state) => state.getIn(['globalContainer', 'isAccountOpen']),
  username: (state) => state.getIn(['globalContainer', 'credential', 'username']),
  listBallots: globalContainerSelectors.ListBallots(),
});

export default compose(
  injectSaga({ key: 'globalContainer', saga: sagas }),
  connect(mapStateToProps, mapDispatchToProps),
)(GlobalContainer);