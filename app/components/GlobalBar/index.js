import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from 'material-ui';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  accountButton: {
    textTransform: 'none',
    paddingRight: 10,
  },
  rightIcon: {
    marginLeft: 5,
  },
});

class GlobalBar extends React.PureComponent {
  handleDrawer = () => this.props.isDrawerOpen
    ? this.props.onCloseDrawerAction()
    : this.props.onOpenDrawerAction();

  handleProfile = () => {
    this.props.onCloseAccountAction();
    this.props.onPush('/app/');
  };

  handlePassword = () => {
    this.props.onCloseAccountAction();
    this.props.onPush('/app/password');
  };

  handleLogout = () => {
    this.props.onCloseAccountAction();
    this.props.onLogoutAction();
  };

  handleLogin = () => {
    this.props.onCloseAccountAction();
    this.props.onPush('/app/login');
  };

  render() {
    const {
      classes,
      username,
      isAccountOpen,
    } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={this.handleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography type="title" color="inherit" className={classes.flex}>
            <FormattedMessage {...messages.header} />
          </Typography>
          {
            username ?
              <div>
                <Button
                  className={classes.accountButton}
                  onClick={this.props.onOpenAccountAction}
                  color="inherit"
                >
                  <span>{username}</span>
                  <AccountCircle className={classes.rightIcon} />
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={isAccountOpen}
                  onClose={this.props.onCloseAccountAction}
                >
                  <MenuItem onClick={this.handleProfile}>
                    <FormattedMessage {...messages.profile} />
                  </MenuItem>
                  <MenuItem onClick={this.handlePassword}>
                    <FormattedMessage {...messages.password} />
                  </MenuItem>
                  <MenuItem onClick={this.handleLogout}>
                    <FormattedMessage {...messages.logout} />
                  </MenuItem>
                </Menu>
              </div>
              :
              <Button onClick={this.handleLogin} color="inherit">
                <FormattedMessage {...messages.login} />
              </Button>
          }
        </Toolbar>
      </AppBar>
    );
  }
}

GlobalBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onPush: PropTypes.func.isRequired,
  username: PropTypes.string,
  isDrawerOpen: PropTypes.bool.isRequired,
  isAccountOpen: PropTypes.bool.isRequired,
  onOpenDrawerAction: PropTypes.func.isRequired,
  onCloseDrawerAction: PropTypes.func.isRequired,
  onOpenAccountAction: PropTypes.func.isRequired,
  onCloseAccountAction: PropTypes.func.isRequired,
  onLogoutAction: PropTypes.func.isRequired,
};

export const styledGlobalBar = withStyles(styles)(GlobalBar);

export default styledGlobalBar;
