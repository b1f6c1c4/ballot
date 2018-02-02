import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import * as preVotingContainerSelectors from './selectors';
import * as preVotingContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';

export class PreVotingContainer extends React.PureComponent {
  render() {
    const {
      match,
      ballot,
      ...other
    } = this.props;

    return (
      <div style={{ wordWrap: 'break-word' }}>
        {match.params.bId}
        <br />
        <pre>{JSON.stringify(ballot, null, 2)}</pre>
        <br />
        <pre>{JSON.stringify(other, null, 2)}</pre>
      </div>
    );
  }
}

PreVotingContainer.propTypes = {
  match: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  ticket: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  isSignLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch, { match }) {
  const { bId } = match.params;
  return {
    onRefresh: () => dispatch(preVotingContainerActions.refreshRequest({ bId })),
    onSign: (param) => dispatch(preVotingContainerActions.signRequest(param)),
  };
}

const mapStateToProps = createStructuredSelector({
  isLoading: (state) => state.getIn(['preVotingContainer', 'isLoading']),
  isSignLoading: (state) => state.getIn(['preVotingContainer', 'isSignLoading']),
  ballot: preVotingContainerSelectors.Ballot(),
  error: preVotingContainerSelectors.Error(),
  ticket: preVotingContainerSelectors.Ticket(),
});

export default compose(
  injectSaga({ key: 'preVotingContainer', saga: sagas }),
  injectReducer({ key: 'preVotingContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(PreVotingContainer);
