import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import {
  withStyles,
} from 'material-ui';
import Countdown from 'react-countdown';
import ConfirmDialog from 'components/ConfirmDialog';
import DocumentTitle from 'components/DocumentTitle';
import GlobalBar from 'components/GlobalBar';
import GlobalDrawer from 'components/GlobalDrawer';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  root: {
    width: '100%',
  },
  wrapper: {
    marginTop: 70,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 1024,
  },
  deadline: {
    color: 'red',
  },
});

class GlobalPage extends React.PureComponent {
  state = {
    isOpen: false,
  };

  componentWillMount() {
    window.addEventListener('mousemove', this.setActive);
    window.addEventListener('keydown', this.setActive);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isOpen && prevProps.extendDeadline !== this.props.extendDeadline) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isOpen: false });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.setActive);
    window.removeEventListener('keydown', this.setActive);
  }

  onTick = () => {
    const { extendDeadline: ddl } = this.props;
    const { isOpen, activity } = this.state;
    if (isOpen || !ddl || (ddl * 1000) - new Date() >= 30000) {
      return;
    }
    if (activity && new Date() - activity <= 60000 && this.props.extendCount) {
      this.props.onExtendAction();
    } else {
      this.setState({ isOpen: true });
    }
  };

  setActive = () => {
    this.setState((state) => ({ ...state, activity: new Date() }));
  };

  render() {
    const {
      classes, // eslint-disable-line no-unused-vars
      onPush,
      onLanguage,
      extendCount,
      extendDeadline,
      username,
      listBallots,
      isAccountOpen,
      isDrawerOpen,
      onOpenDrawerAction,
      onCloseDrawerAction,
      onOpenAccountAction,
      onCloseAccountAction,
      onLogoutAction,
      onExtendAction,
    } = this.props;

    return (
      <div className={classes.root}>
        <DocumentTitle />
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
        <GlobalDrawer
          {...{
            onPush,
            onLanguage,
            username,
            listBallots,
            isDrawerOpen,
            onCloseDrawerAction,
          }}
        />
        <div className={classes.wrapper}>
          {this.props.children}
        </div>
        <ConfirmDialog
          title={messages.extendTitle}
          description={messages.extendDescription}
          cancel={messages.extendNo}
          confirm={messages.extendYes}
          isOpen={!!extendDeadline && this.state.isOpen}
          onCancel={onLogoutAction}
          onAction={onExtendAction}
          disabled={extendCount <= 0}
        >
          <span className={classes.deadline}>
            {extendDeadline && (
              <Countdown
                date={new Date(extendDeadline * 1000)}
                daysInHours
                onTick={this.onTick}
                onComplete={onLogoutAction}
              />
            )}
          </span>
        </ConfirmDialog>
      </div>
    );
  }
}

GlobalPage.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.any,
  onPush: PropTypes.func.isRequired,
  onLanguage: PropTypes.func.isRequired,
  extendCount: PropTypes.number,
  extendDeadline: PropTypes.number,
  username: PropTypes.string,
  listBallots: PropTypes.array,
  isDrawerOpen: PropTypes.bool.isRequired,
  isAccountOpen: PropTypes.bool.isRequired,
  onOpenDrawerAction: PropTypes.func.isRequired,
  onCloseDrawerAction: PropTypes.func.isRequired,
  onOpenAccountAction: PropTypes.func.isRequired,
  onCloseAccountAction: PropTypes.func.isRequired,
  onLogoutAction: PropTypes.func.isRequired,
  onExtendAction: PropTypes.func.isRequired,
};

export default compose(
  withStyles(styles),
)(GlobalPage);
