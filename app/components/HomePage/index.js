import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
  Button,
} from 'material-ui';
import LoadingButton from 'components/LoadingButton/Loadable';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  actions: {
    display: 'flex',
  },
});

class HomePage extends React.PureComponent {
  handleCreate = () => this.props.onPush('/app/create');

  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes, isLoading } = this.props;

    if (!this.props.hasCredential) {
      return (
        <Typography type="display2">
          <FormattedMessage {...messages.noCredential} />
        </Typography>
      );
    }

    return (
      <div>
        <Typography type="display2">
          <FormattedMessage {...messages.header} />
        </Typography>
        <div className={classes.actions}>
          <LoadingButton>
            <Button
              color="secondary"
              raised
              onClick={this.handleCreate}
            >
              <FormattedMessage {...messages.create} />
            </Button>
          </LoadingButton>
          <LoadingButton {...{ isLoading }}>
            <Button
              color="primary"
              disabled={isLoading}
              onClick={this.props.onRefreshListBallots}
            >
              <FormattedMessage {...messages.refresh} />
            </Button>
          </LoadingButton>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  onPush: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  hasCredential: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  listBallots: PropTypes.array,
  onRefreshListBallots: PropTypes.func.isRequired,
};

export const styledHomePage = withStyles(styles)(HomePage);

export default styledHomePage;
