import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
  Button,
  Paper,
} from 'material-ui';
import { reduxForm, propTypes } from 'redux-form/immutable';
import BallotMeta from 'components/BallotMeta';
import TextField from 'components/TextField';
import ClearButton from 'components/ClearButton';
import LoadingButton from 'components/LoadingButton';
import RefreshButton from 'components/RefreshButton';
import ResultIndicator from 'components/ResultIndicator';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit,
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    padding: theme.spacing.unit,
    overflowX: 'auto',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  formActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  secret: {
    fontFamily: 'monospace',
    overflowWrap: 'break-word',
  },
});

class VoterRegPage extends React.PureComponent {
  componentDidMount() {
    this.props.onRefresh();
  }

  handleRegister = (vals) => this.props.onRegister({
    comment: vals.get('comment'),
  });

  render() {
    const {
      classes,
      bId,
      ballot,
      error,
      reset,
      handleSubmit,
      isLoading,
      isRegLoading,
      privateKey,
    } = this.props;

    return (
      <div className={classes.container}>
        <BallotMeta
          {...{
            onPush: this.props.onPush,
            bId,
            ballot,
            isLoading,
          }}
        />
        <div className={classes.actions}>
          <LoadingButton {...{ isLoading }}>
            <RefreshButton
              isLoading={isLoading || isRegLoading}
              onClick={this.props.onRefresh}
            />
          </LoadingButton>
        </div>
        <ResultIndicator error={this.props.refreshError} />
        {!isLoading && (
          <Paper className={classes.root}>
            <form onSubmit={handleSubmit(this.handleRegister)}>
              <Typography type="title">
                <FormattedMessage {...messages.header} />
              </Typography>
              <div>
                <TextField
                  name="comment"
                  label={messages.commentLabel}
                  helperText={messages.commentHelperText}
                  disabled={isRegLoading || privateKey}
                  fullWidth
                />
                <ResultIndicator {...{ error }} />
              </div>
              {!privateKey && (
                <div className={classes.formActions}>
                  <ClearButton
                    reset={reset}
                    isLoading={isRegLoading}
                  />
                  <LoadingButton isLoading={isRegLoading}>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isRegLoading}
                    >
                      <FormattedMessage {...messages.register} />
                    </Button>
                  </LoadingButton>
                </div>
              )}
              {privateKey && (
                <Typography component="p">
                  <FormattedMessage {...messages.privateKey} />
                </Typography>
              )}
              {privateKey && (
                <span className={classes.secret}>{privateKey}</span>
              )}
            </form>
          </Paper>
        )}
      </div>
    );
  }
}

VoterRegPage.propTypes = {
  ...propTypes,
  classes: PropTypes.object.isRequired,
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  ballot: PropTypes.object,
  refreshError: PropTypes.object,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  isRegLoading: PropTypes.bool.isRequired,
  onRegister: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  privateKey: PropTypes.string,
};

export const styledVoterRegPage = withStyles(styles)(VoterRegPage);

export default compose(
  reduxForm({ form: 'voterRegForm' }),
)(styledVoterRegPage);
