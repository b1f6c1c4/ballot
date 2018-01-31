import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
  Typography,
} from 'material-ui';
import Loading from 'components/Loading';
import Abbreviation from 'components/Abbreviation/Loadable';
import LoadingButton from 'components/LoadingButton/Loadable';
import RefreshButton from 'components/RefreshButton/Loadable';
import StatusBadge from 'components/StatusBadge/Loadable';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit,
  },
  badge: {
    display: 'inline-block',
    verticalAlign: 'super',
    marginLeft: theme.spacing.unit * 2,
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    padding: theme.spacing.unit,
    overflowX: 'auto',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

class ViewBallotPage extends React.PureComponent {
  componentDidMount() {
    this.handleRefresh();
  }

  handleRefresh = () => this.props.onRefresh(this.props.bId);

  render() {
    const {
      intl, // eslint-disable-line no-unused-vars
      classes,
      bId,
      isLoading,
      ballot,
    } = this.props;

    return (
      <div className={classes.container}>
        {!isLoading && ballot && (
          <Typography type="display2">
            {ballot.name}
            <Typography className={classes.badge} type="subheading" component="span">
              <StatusBadge status={ballot.status} />
            </Typography>
          </Typography>
        )}
        {isLoading && (
          <Loading />
        )}
        <Typography type="subheading">
          <FormattedMessage {...messages.bId} />
          <Abbreviation text={bId} allowExpand />
        </Typography>
        <div className={classes.actions}>
          <LoadingButton {...{ isLoading }}>
            <RefreshButton
              isLoading={isLoading}
              onClick={this.handleRefresh}
            />
          </LoadingButton>
        </div>
      </div>
    );
  }
}

ViewBallotPage.propTypes = {
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export const styledViewBallotPage = withStyles(styles)(ViewBallotPage);

export default injectIntl(styledViewBallotPage);
