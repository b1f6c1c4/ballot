import _ from 'lodash';
import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
  Typography,
  Button,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
} from 'material-ui';
import { Select } from 'redux-form-material-ui';
import { Field, reduxForm, propTypes } from 'redux-form/immutable';
import BallotMeta from 'components/BallotMeta';
import TextField from 'components/TextField';
import ClearButton from 'components/ClearButton';
import LoadingButton from 'components/LoadingButton';
import RefreshButton from 'components/RefreshButton';
import ResultIndicator from 'components/ResultIndicator';
import EmptyIndicator from 'components/EmptyIndicator';
import make, { required, hexChar } from 'utils/validation';

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
  formControl: {
    minWidth: 300,
  },
  secret: {
    fontFamily: 'monospace',
    overflowWrap: 'break-word',
  },
});

class PreVotingPage extends React.PureComponent {
  componentDidMount() {
    this.props.onRefresh();
  }

  validate = make(
    this.props.intl,
    required(),
  );
  validatePrivateKey = make(
    this.props.intl,
    required(),
    hexChar(),
  );

  handleSign = (vals) => {
    const result = [];
    _.mapValues(vals.toJS(), (v, k) => {
      if (!/^[0-9]+$/.test(k)) return;
      result[parseInt(k, 10)] = v;
    });
    return this.props.onSign({
      result,
      privateKey: vals.get('privateKey'),
    });
  };

  render() {
    const {
      classes,
      bId,
      ballot,
      fields,
      error,
      reset,
      handleSubmit,
      isLoading,
      isSignLoading,
      ticket,
    } = this.props;

    const makeField = (f, i) => {
      switch (f.type) {
        case 'StringField':
          return (
            <div key={f.key}>
              <TextField
                name={String(i)}
                disabled={isSignLoading || ticket}
                label={f.prompt}
                fullWidth
              />
            </div>
          );
        case 'EnumField':
          return (
            <div key={f.key}>
              <FormControl className={classes.formControl}>
                <InputLabel>
                  {f.prompt}
                </InputLabel>
                <Field
                  name={String(i)}
                  disabled={isSignLoading || ticket}
                  component={Select}
                  validate={this.validate}
                >
                  {f.items.map((c) => (
                    <MenuItem value={c}>{c}</MenuItem>
                  ))}
                </Field>
              </FormControl>
            </div>
          );
        default:
          return (
            <ResultIndicator error={{ codes: ['tpns'] }} />
          );
      }
    };

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
              isLoading={isLoading || isSignLoading}
              onClick={this.props.onRefresh}
            />
          </LoadingButton>
        </div>
        <ResultIndicator error={this.props.refreshError} />
        {!isLoading && (
          <Paper className={classes.root}>
            <form onSubmit={handleSubmit(this.handleSign)}>
              <Typography type="title">
                <FormattedMessage {...messages.header} />
              </Typography>
              <EmptyIndicator
                isLoading={isLoading}
                list={ballot && fields}
              />
              {ballot && fields && fields.map(makeField)}
              <div>
                <TextField
                  name="privateKey"
                  label={messages.pvLabel}
                  helperText={messages.pvHelperText}
                  disabled={isSignLoading || ticket}
                  fullWidth
                  validate={this.validatePrivateKey}
                />
                <ResultIndicator {...{ error }} />
              </div>
              {!ticket && (
                <div className={classes.formActions}>
                  <ClearButton
                    reset={reset}
                    isLoading={isSignLoading}
                  />
                  <LoadingButton isLoading={isSignLoading}>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSignLoading}
                    >
                      <FormattedMessage {...messages.sign} />
                    </Button>
                  </LoadingButton>
                </div>
              )}
              {ticket && (
                <Typography component="p">
                  <FormattedMessage {...messages.ticket} />
                </Typography>
              )}
              {ticket && (
                <span className={classes.secret}>
                  {btoa(JSON.stringify(ticket))}
                </span>
              )}
            </form>
          </Paper>
        )}
      </div>
    );
  }
}

PreVotingPage.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  ballot: PropTypes.object,
  refreshError: PropTypes.object,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  isSignLoading: PropTypes.bool.isRequired,
  onSign: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  ticket: PropTypes.object,
};

export const styledPreVotingPage = withStyles(styles)(PreVotingPage);

export default compose(
  reduxForm({ form: 'preVotingForm' }),
  injectIntl,
)(styledPreVotingPage);
