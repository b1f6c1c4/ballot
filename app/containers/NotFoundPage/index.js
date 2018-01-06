import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

import {
  withStyles,
} from 'material-ui';

import messages from './messages';

const styles = (theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
  },
});

class NotFoundPage extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.content}>
        <FormattedMessage {...messages.header} />
        <Link to="/"><FormattedMessage {...messages.returnHome} /></Link>
      </div>
    );
  }
}

NotFoundPage.propTypes = {
  classes: PropTypes.object.isRequired,
};


export const styledNotFoundPage = withStyles(styles, { withTheme: true })(NotFoundPage);

export default compose(
  connect(null, null),
)(styledNotFoundPage);
