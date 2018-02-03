import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
} from 'material-ui';
import Loading from 'components/Loading';
import Abbreviation from 'components/Abbreviation';
import StatusBadge from 'components/StatusBadge';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  badge: {
    display: 'inline-block',
    verticalAlign: 'super',
    marginLeft: theme.spacing.unit * 2,
  },
});

class BallotMeta extends React.PureComponent {
  handleClick = () => {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    } else {
      this.props.onPush(`/app/ballots/${this.props.bId}`);
    }
  };

  render() {
    const {
      classes,
      isLoading,
      ballot,
      bId,
    } = this.props;

    return (
      <div>
        {!isLoading && ballot && (
          <Typography
            type="display2"
            gutterBottom
            onClick={this.handleClick}
          >
            {ballot.name}
            <Typography className={classes.badge} type="subheading" component="span">
              <StatusBadge status={ballot.status} />
            </Typography>
          </Typography>
        )}
        {isLoading && (
          <Loading />
        )}
        <Typography type="caption">
          <FormattedMessage {...messages.bId} />
          <Abbreviation text={bId} allowExpand />
        </Typography>
      </div>
    );
  }
}

BallotMeta.propTypes = {
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func,
};

export const styledBallotMeta = withStyles(styles)(BallotMeta);

export default styledBallotMeta;