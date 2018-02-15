import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from 'material-ui';
import { Home, Lock } from 'material-ui-icons';
import StatusBadge from 'components/StatusBadge';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  drawer: {
    width: 300,
  },
});

class GlobalDrawer extends React.PureComponent {
  handleProfile = () => {
    this.props.onCloseDrawerAction();
    this.props.onPush('/app/');
  };

  handleLogin = () => {
    this.props.onCloseDrawerAction();
    this.props.onPush('/app/login');
  };

  handleBallot = (b) => () => {
    this.props.onCloseDrawerAction();
    this.props.onPush(`/app/ballots/${b.bId}`);
  };

  render() {
    const {
      intl,
      classes,
      username,
      listBallots,
    } = this.props;

    let ballots;
    if (username && listBallots) {
      ballots = listBallots.map((b) => {
        const content = (
          <span>
            {b.name}
            <StatusBadge status={b.status} minor />
          </span>
        );
        return (
          <ListItem key={b.bId} button onClick={this.handleBallot(b)}>
            <ListItemText primary={content} />
          </ListItem>
        );
      });
    }

    return (
      <Drawer
        open={this.props.isDrawerOpen}
        onClose={this.props.onCloseDrawerAction}
      >
        <List
          component="nav"
          className={classes.drawer}
        >
          {!username && (
            <ListItem button onClick={this.handleLogin}>
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText primary={intl.formatMessage(messages.login)} />
            </ListItem>
          )}
          {username && (
            <ListItem button onClick={this.handleProfile}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary={intl.formatMessage(messages.profile)} />
            </ListItem>
          )}
          <Divider />
          {ballots}
        </List>
      </Drawer>
    );
  }
}

GlobalDrawer.propTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  onPush: PropTypes.func.isRequired,
  username: PropTypes.string,
  listBallots: PropTypes.array,
  isDrawerOpen: PropTypes.bool.isRequired,
  onCloseDrawerAction: PropTypes.func.isRequired,
};

export const styledGlobalDrawer = withStyles(styles)(GlobalDrawer);

export default injectIntl(styledGlobalDrawer);
