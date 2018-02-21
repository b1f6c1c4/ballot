import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import ViewBallotPage from 'components/ViewBallotPage';

import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as viewBallotContainerSelectors from './selectors';
import * as viewBallotContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';

export class ViewBallotContainer extends React.PureComponent {
  componentWillMount() {
    this.props.onStatusRequestAction();
    this.props.onVoterRgRequestAction();
    if (this.props.match.params.bId !== _.get(this.props.ballot, 'bId')) {
      this.props.onRefresh();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.match.params, this.props.match.params)) {
      nextProps.onRefresh();
      nextProps.onStatusRequestAction();
      nextProps.onVoterRgRequestAction();
    }
  }

  componentWillUnmount() {
    this.props.onStatusStopAction();
    this.props.onVoterRgStopAction();
  }

  render() {
    const {
      match,
      ballot,
      ...other
    } = this.props;

    return (
      <ViewBallotPage
        bId={match.params.bId}
        ballot={ballot}
        {...other}
      />
    );
  }
}

ViewBallotContainer.propTypes = {
  onPush: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  count: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onFinalize: PropTypes.func.isRequired,
  onStatusRequestAction: PropTypes.func.isRequired,
  onStatusStopAction: PropTypes.func.isRequired,
  onVoterRgRequestAction: PropTypes.func.isRequired,
  onVoterRgStopAction: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch, { match }) {
  const { bId } = match.params;
  return {
    onPush: (url) => dispatch(push(url)),
    onRefresh: () => dispatch(viewBallotContainerActions.ballotRequest({ bId })),
    onExport: () => dispatch(viewBallotContainerActions.exportRequest({ bId })),
    onFinalize: () => dispatch(viewBallotContainerActions.finalizeRequest({ bId })),
    onStatusRequestAction: () => dispatch(subscriptionContainerActions.statusRequest({ bId })),
    onStatusStopAction: () => dispatch(subscriptionContainerActions.statusStop()),
    onVoterRgRequestAction: () => dispatch(subscriptionContainerActions.voterRgRequest({ bId })),
    onVoterRgStopAction: () => dispatch(subscriptionContainerActions.voterRgStop()),
  };
}

const mapStateToProps = createStructuredSelector({
  hasCredential: (state) => !!state.getIn(['globalContainer', 'credential']),
  isLoading: (state) => state.getIn(['viewBallotContainer', 'isLoading']),
  ballot: viewBallotContainerSelectors.Ballot(),
  error: viewBallotContainerSelectors.Error(),
  count: (state) => state.getIn(['viewBallotContainer', 'count']),
});

export default compose(
  injectSaga({ key: 'viewBallotContainer', saga: sagas }),
  injectReducer({ key: 'viewBallotContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(ViewBallotContainer);
