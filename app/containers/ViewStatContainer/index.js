import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import ViewStatPage from 'components/ViewStatPage';

import * as viewStatContainerSelectors from './selectors';
import * as viewStatContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';

export class ViewStatContainer extends React.PureComponent {
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
      ...other
    } = this.props;

    return (
      <ViewStatPage
        bId={match.params.bId}
        {...other}
      />
    );
  }
}

ViewStatContainer.propTypes = {
  onPush: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isStatsLoading: PropTypes.bool.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  fieldIndex: PropTypes.number.isRequired,
  stat: PropTypes.array,
  onRefresh: PropTypes.func.isRequired,
  onChangeFieldAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch, { match }) {
  const { bId } = match.params;
  return {
    onPush: (url) => dispatch(push(url)),
    onRefresh: () => dispatch(viewStatContainerActions.ballotRequest({ bId })),
    onChangeFieldAction: (index) => dispatch(viewStatContainerActions.changeField(index)),
  };
}

const mapStateToProps = createStructuredSelector({
  isLoading: (state) => state.getIn(['viewStatContainer', 'isLoading']),
  isStatsLoading: (state) => state.getIn(['viewStatContainer', 'isStatsLoading']),
  fieldIndex: (state) => state.getIn(['viewStatContainer', 'fieldIndex']),
  ballot: viewStatContainerSelectors.Ballot(),
  stat: viewStatContainerSelectors.Stat(),
});

export default compose(
  injectSaga({ key: 'viewStatContainer', saga: sagas }),
  injectReducer({ key: 'viewStatContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(ViewStatContainer);
