import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
  withMobileDialog,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
} from 'material-ui';
import { Select } from 'redux-form-material-ui';
import {
  Field,
  reduxForm,
  propTypes,
  formValueSelector,
  SubmissionError,
} from 'redux-form/immutable';
import ResultIndicator from 'components/ResultIndicator';
import TextField from 'components/TextField';
import make, { required, properLines } from 'utils/validation';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  width: {
    minWidth: 600,
  },
  formControl: {
    minWidth: 120,
  },
});

class EditFieldDialog extends React.PureComponent {
  validate = make(
    this.props.intl,
    required(),
  );
  validateItems = make(
    this.props.intl,
    required(),
    properLines(),
  );

  handleDone = (vals) => {
    const type = vals.get('type');
    const common = {
      type,
      prompt: vals.get('prompt'),
    };
    switch (type) {
      case 'StringField':
        return this.props.onSubmit({
          ...common,
          stringDefault: vals.get('stringDefault'),
        });
      case 'EnumField': {
        const raw = vals.get('enumItems');
        const enumItems = raw && raw.split('\n');
        return this.props.onSubmit({
          ...common,
          enumItems,
        });
      }
      default:
        throw new SubmissionError({
          type: 'www',
        });
    }
  };

  handleCancel = () => {
    this.props.reset();
    this.props.onCancel();
  };

  render() {
    const {
      pristine,
      classes,
      isCreate,
      disabled,
      type,
      handleSubmit,
    } = this.props;

    return (
      <Dialog fullScreen={this.props.fullScreen} open={this.props.isOpen}>
        <form onSubmit={handleSubmit(this.handleDone)}>
          <DialogTitle className={classes.width}>
            {!disabled && isCreate && (
              <FormattedMessage {...messages.createHeader} />
            )}
            {!disabled && !isCreate && (
              <FormattedMessage {...messages.editHeader} />
            )}
            {disabled && (
              <FormattedMessage {...messages.viewHeader} />
            )}
          </DialogTitle>
          <DialogContent>
            <div>
              <TextField
                name="prompt"
                disabled={disabled}
                label={messages.promptLabel}
                helperText={messages.promptHelperText}
                validate={this.validate}
              />
            </div>
            <FormControl className={classes.formControl}>
              <InputLabel>
                <FormattedMessage {...messages.typeLabel} />
              </InputLabel>
              <Field
                name="type"
                disabled={disabled}
                component={Select}
              >
                <MenuItem value="EnumField">
                  <FormattedMessage {...messages.enumField} />
                </MenuItem>
                <MenuItem value="StringField">
                  <FormattedMessage {...messages.stringField} />
                </MenuItem>
              </Field>
            </FormControl>
            {type === 'StringField' && (
              <div>
                <TextField
                  name="stringDefault"
                  disabled={disabled}
                  label={messages.defaultLabel}
                  helperText={messages.defaultHelperText}
                />
              </div>
            )}
            {type === 'EnumField' && (
              <div>
                <TextField
                  name="enumItems"
                  disabled={disabled}
                  multiline
                  label={messages.enumLabel}
                  helperText={messages.enumHelperText}
                  validate={this.validateItems}
                />
              </div>
            )}
            <ResultIndicator error={this.props.error} />
          </DialogContent>
          <DialogActions>
            <Button
              raised={!pristine}
              color={pristine ? 'primary' : 'secondary'}
              onClick={this.handleCancel}
            >
              {!disabled && (
                <FormattedMessage {...messages.cancel} />
              )}
              {disabled && (
                <FormattedMessage {...messages.close} />
              )}
            </Button>
            {!disabled && (
              <Button
                type="submit"
                raised={!pristine}
                color="primary"
                onClick={this.handleSubmit}
              >
                {isCreate && (
                  <FormattedMessage {...messages.create} />
                )}
                {!isCreate && (
                  <FormattedMessage {...messages.save} />
                )}
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

EditFieldDialog.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isCreate: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  type: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const selector = formValueSelector('editFieldForm');

export const styledEditFieldDialog = withStyles(styles)(EditFieldDialog);

export default compose(
  connect((state) => ({ type: selector(state, 'type') })),
  reduxForm({ form: 'editFieldForm' }),
  injectIntl,
  withMobileDialog(),
)(styledEditFieldDialog);
