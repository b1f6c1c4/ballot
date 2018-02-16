import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import PreVotingPage from 'components/PreVotingPage';

import * as preVotingContainerSelectors from './selectors';
import * as preVotingContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';

export class PreVotingContainer extends React.PureComponent {
  componentWillMount() {
    this.props.onRefresh();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.match.params, this.props.match.params)) {
      nextProps.onRefresh();
    }
  }

  render() {
    const {
      match,
      error,
      ...other
    } = this.props;

    return (
      <PreVotingPage
        bId={match.params.bId}
        refreshError={error}
        {...other}
      />
    );
  }
}

PreVotingContainer.propTypes = {
  onPush: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  fields: PropTypes.array,
  ticket: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  isSignLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch, { match }) {
  const { bId } = match.params;
  return {
    onPush: (url) => dispatch(push(url)),
    onRefresh: () => dispatch(preVotingContainerActions.refreshRequest({ bId })),
    onSign: ({ result, privateKey }) => dispatch(preVotingContainerActions.signRequest({
      payload: { bId, result },
      privateKey,
    })),
  };
}

const mapStateToProps = createStructuredSelector({
  isLoading: (state) => state.getIn(['preVotingContainer', 'isLoading']),
  isSignLoading: (state) => state.getIn(['preVotingContainer', 'isSignLoading']),
  ballot: preVotingContainerSelectors.Ballot(),
  error: preVotingContainerSelectors.Error(),
  fields: preVotingContainerSelectors.Fields(),
  ticket: preVotingContainerSelectors.Ticket(),
});

export default compose(
  injectSaga({ key: 'preVotingContainer', saga: sagas }),
  injectReducer({ key: 'preVotingContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(PreVotingContainer);