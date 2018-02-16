import _ from 'lodash';
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
  componentWillMount() {
    if (this.props.match.params.bId !== _.get(this.props.ballot, 'bId')) {
      this.props.onRefresh();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.match.params, this.props.match.params)) {
      nextProps.onRefresh();
    }
  }

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
  isPristine: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isCreate: PropTypes.bool.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  fields: PropTypes.array,
  onRefresh: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemoveAction: PropTypes.func.isRequired,
  onReorderAction: PropTypes.func.isRequired,
  onStartEditAction: PropTypes.func.isRequired,
  onStartCreateAction: PropTypes.func.isRequired,
  onCancelDialogAction: PropTypes.func.isRequired,
  onSubmitDialogAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch, { match }) {
  const { bId } = match.params;
  return {
    onPush: (url) => dispatch(push(url)),
    onRefresh: () => dispatch(editFieldsContainerActions.refreshRequest({ bId })),
    onSave: () => dispatch(editFieldsContainerActions.saveRequest({ bId })),
    onRemoveAction: (param) => dispatch(editFieldsContainerActions.remove(param)),
    onReorderAction: (param) => dispatch(editFieldsContainerActions.reorder(param)),
    onStartEditAction: (param) => dispatch(editFieldsContainerActions.startEdit(param)),
    onStartCreateAction: () => dispatch(editFieldsContainerActions.startCreate()),
    onCancelDialogAction: () => dispatch(editFieldsContainerActions.cancelDialog()),
    onSubmitDialogAction: (param) => dispatch(editFieldsContainerActions.submitDialog(param)),
  };
}

const mapStateToProps = createStructuredSelector({
  hasCredential: (state) => !!state.getIn(['globalContainer', 'credential']),
  isLoading: (state) => state.getIn(['editFieldsContainer', 'isLoading']),
  isPristine: (state) => state.getIn(['editFieldsContainer', 'isPristine']),
  isOpen: (state) => state.getIn(['editFieldsContainer', 'isOpen']),
  isCreate: (state) => state.getIn(['editFieldsContainer', 'isCreate']),
  ballot: editFieldsContainerSelectors.Ballot(),
  fields: editFieldsContainerSelectors.Fields(),
  error: editFieldsContainerSelectors.Error(),
});

export default compose(
  injectSaga({ key: 'editFieldsContainer', saga: sagas }),
  injectReducer({ key: 'editFieldsContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(EditFieldsContainer);
