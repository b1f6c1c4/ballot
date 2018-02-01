import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import EditFieldsPage from 'components/EditFieldsPage';

import * as editFieldsContainerSelectors from './selectors';
import * as editFieldsContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';

export class EditFieldsContainer extends React.PureComponent {
  render() {
    const {
      match,
      ...other
    } = this.props;

    return (
      <EditFieldsPage
        bId={match.params.bId}
        {...other}
      />
    );
  }
}

EditFieldsContainer.propTypes = {
  onPush: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  fields: PropTypes.array,
  onRefresh: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onAddAction: PropTypes.func.isRequired,
  onRemoveAction: PropTypes.func.isRequired,
  onReorderAction: PropTypes.func.isRequired,
  onStartEditAction: PropTypes.func.isRequired,
  onCancelEditAction: PropTypes.func.isRequired,
  onSaveEditAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch, { match }) {
  const { bId } = match.params;
  return {
    onPush: (url) => dispatch(push(url)),
    onRefresh: () => dispatch(editFieldsContainerActions.refreshRequest({ bId })),
    onAddAction: () => dispatch(editFieldsContainerActions.add()),
    onRemoveAction: () => dispatch(editFieldsContainerActions.remove()),
    onReorderAction: () => dispatch(editFieldsContainerActions.reorder()),
    onStartEditAction: () => dispatch(editFieldsContainerActions.startEdit()),
    onCancelEditAction: () => dispatch(editFieldsContainerActions.cancelEdit()),
    onSaveEditAction: () => dispatch(editFieldsContainerActions.saveEdit()),
    onSave: () => dispatch(editFieldsContainerActions.saveRequest({ bId })),
  };
}

const mapStateToProps = createStructuredSelector({
  hasCredential: (state) => !!state.getIn(['globalContainer', 'credential']),
  isLoading: (state) => state.getIn(['editFieldsContainer', 'isLoading']),
  ballot: editFieldsContainerSelectors.Ballot(),
  fields: editFieldsContainerSelectors.Fields(),
  error: editFieldsContainerSelectors.Error(),
});

export default compose(
  injectSaga({ key: 'editFieldsContainer', saga: sagas }),
  injectReducer({ key: 'editFieldsContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(EditFieldsContainer);
