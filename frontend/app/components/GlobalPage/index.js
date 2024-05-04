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
  render() {
    const {
      classes, // eslint-disable-line no-unused-vars
      onPush,
      onLanguage,
      extendDeadline,
      username,
      listBallots,
      isAccountOpen,
      isDrawerOpen,
      isOpenExtend,
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
          isOpen={isOpenExtend}
          onCancel={onLogoutAction}
          onAction={onExtendAction}
        >
          <span className={classes.deadline}>
            <Countdown
              date={new Date(extendDeadline * 1000)}
              daysInHours
              onComplete={onLogoutAction}
            />
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
  extendDeadline: PropTypes.number.isRequired,
  username: PropTypes.string,
  listBallots: PropTypes.array,
  isDrawerOpen: PropTypes.bool.isRequired,
  isAccountOpen: PropTypes.bool.isRequired,
  isOpenExtend: PropTypes.bool.isRequired,
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
