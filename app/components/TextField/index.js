import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
} from 'material-ui';
import { TextField as RawTextField } from 'redux-form-material-ui';
import { Field } from 'redux-form/immutable';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
});

class TextField extends React.PureComponent {
  render() {
    // eslint-disable-next-line no-unused-vars
    const {
      intl,
      classes,
      type,
      label,
      helperText,
      ...other
    } = this.props;

    return (
      <Field
        {...other}
        type={type || 'text'}
        component={RawTextField}
        margin="dense"
        label={intl.formatMessage(label)}
        helperText={helperText && intl.formatMessage(helperText)}
        fullWidth
      />
    );
  }
}

TextField.propTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  type: PropTypes.string,
  label: PropTypes.object.isRequired,
  helperText: PropTypes.object,
};

export const styledTextField = withStyles(styles)(TextField);

export default injectIntl(styledTextField);
