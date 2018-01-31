import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import EditVotersPage from 'components/EditVotersPage/Loadable';

import {
  makeSelectEditVotersContainerBallot,
  makeSelectEditVotersContainerListVoters,
} from './selectors';
import * as editVotersContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';

export class EditVotersContainer extends React.PureComponent {
  render() {
    const {
      match,
      listVoters,
      ...other
    } = this.props;

    return (
      <EditVotersPage
        bId={match.params.bId}
        voters={listVoters}
        {...other}
      />
    );
  }
}

EditVotersContainer.propTypes = {
  onPush: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  ballot: PropTypes.object,
  listVoters: PropTypes.array,
};

export function mapDispatchToProps(dispatch) {
  return {
    onPush: (url) => dispatch(push(url)),
    onRefresh: (bId) => dispatch(editVotersContainerActions.votersRequest(bId)),
  };
}

const mapStateToProps = createStructuredSelector({
  hasCredential: (state) => !!state.getIn(['globalContainer', 'credential']),
  isLoading: (state) => state.getIn(['editVotersContainer', 'isLoading']),
  ballot: makeSelectEditVotersContainerBallot(),
  listVoters: makeSelectEditVotersContainerListVoters(),
});

export default compose(
  injectSaga({ key: 'editVotersContainer', saga: sagas }),
  injectReducer({ key: 'editVotersContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(EditVotersContainer);
