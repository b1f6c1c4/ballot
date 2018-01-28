import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import {
  withStyles,
  Typography,
  Button,
} from 'material-ui';

import * as statusContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';
import messages from './messages';

const styles = (theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
  },
});

class StatusContainer extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.content}>
        <FormattedMessage {...messages.header} />
        <Typography>{this.props.version}</Typography>
        <Typography>{this.props.commitHash}</Typography>
        <Button onClick={this.props.onFetchStatusAction}>FetchStatusAction</Button>
      </div>
    );
  }
}

StatusContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
  commitHash: PropTypes.string.isRequired,
  onFetchStatusAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onFetchStatusAction: () => dispatch(statusContainerActions.fetchStatus()),
  };
}

const mapStateToProps = createStructuredSelector({
  version: (state) => state.get('statusContainer').getIn(['status', 'version']),
  commitHash: (state) => state.get('statusContainer').getIn(['status', 'commitHash']),
});

export const styledStatusContainer = withStyles(styles, { withTheme: true })(StatusContainer);

export default compose(
  injectSaga({ key: 'statusContainer', saga: sagas }),
  injectReducer({ key: 'statusContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(styledStatusContainer);
