import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
} from 'material-ui';
import { Link } from 'react-router-dom';
import Loading from 'components/Loading';
import Abbreviation from 'components/Abbreviation';
import StatusBadge from 'components/StatusBadge';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  clickable: {
    cursor: 'pointer',
  },
  badge: {
    display: 'inline-block',
    verticalAlign: 'super',
    marginLeft: theme.spacing.unit * 2,
  },
});

class BallotMeta extends React.PureComponent {
  render() {
    const {
      classes,
      isLoading,
      ballot,
      bId,
      header,
    } = this.props;

    return (
      <div>
        {!isLoading && ballot && (
          <Typography
            variant="display2"
            gutterBottom
          >
            {this.props.onRefresh && (
              <span
                className={classes.clickable}
                onClick={this.props.onRefresh}
              >
                {ballot.name}
              </span>
            )}
            {!this.props.onRefresh && (
              <Link to={`/app/ballots/${this.props.bId}`}>
                {ballot.name}
              </Link>
            )}
            <Typography className={classes.badge} variant="subheading" component="span">
              <StatusBadge status={ballot.status} />
            </Typography>
            {header && (
              <span>
                /
                <FormattedMessage {...header} />
              </span>
            )}
          </Typography>
        )}
        {isLoading && (
          <Loading />
        )}
        <Typography variant="caption">
          <FormattedMessage {...messages.owner} />
          {ballot && ballot.owner}
        </Typography>
        <Typography variant="caption">
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
  header: PropTypes.object,
  onRefresh: PropTypes.func,
};

export default compose(
  withStyles(styles),
)(BallotMeta);
