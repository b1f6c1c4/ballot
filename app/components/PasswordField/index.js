import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import { withStyles } from 'material-ui';
import TextField from 'components/TextField/Loadable';
import make, { required, minChar } from 'utils/validation';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
});

class PasswordField extends React.PureComponent {
  validate = make(
    this.props.intl,
    required(),
    minChar(8),
  );

  render() {
    // eslint-disable-next-line no-unused-vars
    const { intl, classes, ...other } = this.props;

    return (
      <TextField
        {...other}
        type="password"
        label={messages.label}
        helperText={messages.helperText}
        validate={this.validate}
      />
    );
  }
}

PasswordField.propTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
};

export const styledPasswordField = withStyles(styles)(PasswordField);

export default injectIntl(styledPasswordField);
