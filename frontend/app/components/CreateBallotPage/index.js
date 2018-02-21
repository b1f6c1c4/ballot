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
} from 'material-ui';
import { reduxForm, propTypes } from 'redux-form/immutable';
import TextField from 'components/TextField';
import ClearButton from 'components/ClearButton';
import LoadingButton from 'components/LoadingButton';
import ResultIndicator from 'components/ResultIndicator';
import ConfirmDialog from 'components/ConfirmDialog';
import make, { required, alphanumericDash, minChar } from 'utils/validation';

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
    justifyContent: 'flex-end',
  },
});

class CreateBallotPage extends React.PureComponent {
  state = {
    isOpenCreate: false,
  };

  handleConfirm = (ac) => (...args) => {
    if (_.isString(ac)) {
      this.setState(_.assign({}, this.state, { [ac]: true, args }));
      return;
    }
    if (_.isFunction(ac)) {
      ac(...this.state.args);
    }
    this.setState(_.mapValues(this.state, (v, k) => /^isOpen/.test(k) ? false : v));
  };

  validate = make(
    this.props.intl,
    required(),
    alphanumericDash(),
    minChar(1),
  );

  handleCreate = (vals) => this.props.onCreate({
    name: vals.get('name'),
  });

  render() {
    const {
      classes,
      error,
      reset,
      handleSubmit,
      isLoading,
    } = this.props;

    return (
      <div className={classes.container}>
        <Typography variant="display2">
          <FormattedMessage {...messages.header} />
        </Typography>
        <Paper className={classes.root}>
          <form onSubmit={handleSubmit(this.handleConfirm('isOpenCreate'))}>
            <div>
              <TextField
                name="name"
                label={messages.nameLabel}
                helperText={messages.nameHelperText}
                validate={this.validate}
                fullWidth
              />
              <ResultIndicator {...{ error }} />
            </div>
            <div className={classes.actions}>
              <ClearButton {...{ reset, isLoading }} />
              <LoadingButton {...{ isLoading }}>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isLoading}
                >
                  <FormattedMessage {...messages.create} />
                </Button>
              </LoadingButton>
            </div>
          </form>
        </Paper>
        <ConfirmDialog
          title={messages.createTitle}
          description={messages.createDescription}
          isOpen={this.state.isOpenCreate}
          onCancel={this.handleConfirm()}
          onAction={this.handleConfirm(this.handleCreate)}
        />
      </div>
    );
  }
}

CreateBallotPage.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export const styledCreateBallotPage = withStyles(styles)(CreateBallotPage);

export default compose(
  reduxForm({ form: 'createBallotForm' }),
  injectIntl,
)(styledCreateBallotPage);