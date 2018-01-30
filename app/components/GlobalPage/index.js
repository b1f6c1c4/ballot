import React from 'react';
import PropTypes from 'prop-types';

import {
  withStyles,
} from 'material-ui';

import GlobalBar from 'components/GlobalBar/Loadable';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  root: {
    width: '100%',
  },
});

class GlobalPage extends React.PureComponent {
  render() {
    const {
      classes, // eslint-disable-line no-unused-vars
      onPush,
      username,
      isAccountOpen,
      isDrawerOpen,
      onOpenDrawerAction,
      onCloseDrawerAction,
      onOpenAccountAction,
      onCloseAccountAction,
      onLogoutAction,
    } = this.props;

    return (
      <div className={classes.root}>
        <GlobalBar
          {...{
            onPush,
            username,
            isAccountOpen,
            isDrawerOpen,
            onOpenDrawerAction,
            onCloseDrawerAction,
            onOpenAccountAction,
            onCloseAccountAction,
            onLogoutAction,
          }}
        />
        {this.props.children}
      </div>
    );
  }
}

GlobalPage.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element,
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

export const styledGlobalPage = withStyles(styles)(GlobalPage);

export default styledGlobalPage;
