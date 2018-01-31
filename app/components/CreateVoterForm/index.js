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
import TextField from 'components/TextField/Loadable';
import ClearButton from 'components/ClearButton/Loadable';
import LoadingButton from 'components/LoadingButton/Loadable';
import ResultIndicator from 'components/ResultIndicator/Loadable';
import make, { required } from 'utils/validation';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
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

class CreateVoterForm extends React.PureComponent {
  validate = make(
    this.props.intl,
    required(),
  );

  handleCreate = (vals) => this.props.onCreateVoter({
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
      <Paper className={classes.root}>
        <Typography type="headline">
          <FormattedMessage {...messages.header} />
        </Typography>
        <form onSubmit={handleSubmit(this.handleCreate)}>
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
    );
  }
}

CreateVoterForm.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onCreateVoter: PropTypes.func.isRequired,
};

export const styledCreateVoterForm = withStyles(styles)(CreateVoterForm);

export default compose(
  reduxForm({ form: 'createVoterForm' }),
  injectIntl,
)(styledCreateVoterForm);
