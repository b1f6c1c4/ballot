import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import EditVotersPage from 'components/EditVotersPage';

import * as editVotersContainerSelectors from './selectors';
import * as editVotersContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';

export class EditVotersContainer extends React.PureComponent {
  render() {
    const {
      match,
      ...other
    } = this.props;

    return (
      <EditVotersPage
        bId={match.params.bId}
        {...other}
      />
    );
  }
}

EditVotersContainer.propTypes = {
  onPush: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isCreateLoading: PropTypes.bool.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  voters: PropTypes.array,
  onCreateVoter: PropTypes.func.isRequired,
  onDeleteVoter: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch, { match }) {
  const { bId } = match.params;
  return {
    onPush: (url) => dispatch(push(url)),
    onRefresh: () => dispatch(editVotersContainerActions.votersRequest({ bId })),
    onCreateVoter: ({ name }) => dispatch(editVotersContainerActions.createVoterRequest({ bId, name })),
    onDeleteVoter: ({ iCode }) => dispatch(editVotersContainerActions.deleteVoterRequest({ bId, iCode })),
  };
}

const mapStateToProps = createStructuredSelector({
  hasCredential: (state) => !!state.getIn(['globalContainer', 'credential']),
  isLoading: (state) => state.getIn(['editVotersContainer', 'isLoading']),
  isCreateLoading: (state) => state.getIn(['editVotersContainer', 'isCreateLoading']),
  ballot: editVotersContainerSelectors.Ballot(),
  error: editVotersContainerSelectors.Error(),
  voters: editVotersContainerSelectors.Voters(),
});

export default compose(
  injectSaga({ key: 'editVotersContainer', saga: sagas }),
  injectReducer({ key: 'editVotersContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(EditVotersContainer);
