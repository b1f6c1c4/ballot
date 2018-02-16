import React from 'react';
import ReactDOM from 'react-dom';
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
import { Menu as MenuIcon, AccountCircle } from 'material-ui-icons';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  header: {
    flex: 1,
    cursor: 'pointer',
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
  state = { anchorEl: null };

  componentDidUpdate() {
    // eslint-disable-next-line react/no-find-dom-node
    const anchorEl = ReactDOM.findDOMNode(this.anchorEl);
    if (this.state.anchorEl !== anchorEl) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ anchorEl });
    }
  }

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
          <Typography
            component="div"
            onClick={this.handleProfile}
            variant="headline"
            color="inherit"
            className={classes.header}
          >
            <FormattedMessage {...messages.header} />
          </Typography>
          {
            username ?
              <div>
                <Button
                  className={classes.accountButton}
                  ref={(obj) => { this.anchorEl = obj; }}
                  onClick={this.props.onOpenAccountAction}
                  color="inherit"
                >
                  <span>{username}</span>
                  <AccountCircle className={classes.rightIcon} />
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchorEl}
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
