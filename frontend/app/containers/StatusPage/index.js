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

import * as statusPageActions from './actions';
import reducer from './reducer';
import sagas from './sagas';
import messages from './messages';

const styles = (theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
  },
});

class StatusPage extends React.PureComponent {
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

StatusPage.propTypes = {
  classes: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
  commitHash: PropTypes.string.isRequired,
  onFetchStatusAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onFetchStatusAction: () => dispatch(statusPageActions.fetchStatus()),
  };
}

const mapStateToProps = createStructuredSelector({
  version: /* istanbul ignore next */ (state) => state.get('statusPage').getIn(['status', 'version']),
  commitHash: /* istanbul ignore next */ (state) => state.get('statusPage').getIn(['status', 'commitHash']),
});

export const styledStatusPage = withStyles(styles, { withTheme: true })(StatusPage);

export default compose(
  injectSaga({ key: 'statusPage', saga: sagas }),
  injectReducer({ key: 'statusPage', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(styledStatusPage);
