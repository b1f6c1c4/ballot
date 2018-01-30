import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import HomePage from 'components/HomePage/Loadable';

import {
  makeSelectGlobalContainerListBallots,
} from 'containers/GlobalContainer/selectors';
import * as globalContainerActions from 'containers/GlobalContainer/actions';

export class HomeContainer extends React.PureComponent {
  render() {
    return (
      <HomePage {...this.props} />
    );
  }
}

HomeContainer.propTypes = {
  hasCredential: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  listBallots: PropTypes.array,
  onRefreshListBallots: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onPush: (url) => dispatch(push(url)),
    onRefreshListBallots: () => dispatch(globalContainerActions.ballotsRequest()),
  };
}

const mapStateToProps = createStructuredSelector({
  hasCredential: (state) => !!state.getIn(['globalContainer', 'credential']),
  isLoading: (state) => state.getIn(['globalContainer', 'isLoading']),
  listBallots: makeSelectGlobalContainerListBallots(),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(HomeContainer);
