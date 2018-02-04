import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
} from 'material-ui';
import classnames from 'classnames';
import { Delete, ExpandMore } from 'material-ui-icons';
import QRCode from 'qrcode.react';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  card: {
    margin: theme.spacing.unit,
    width: 280,
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  detailWrapper: {
    padding: theme.spacing.unit,
  },
  detailTitle: {
    textAlign: 'center',
  },
  detail: {
    fontFamily: 'monospace',
    overflowWrap: 'break-word',
  },
  qrcode: {
    textAlign: 'center',
  },
});

class VoterCard extends React.PureComponent {
  state = { expanded: false };

  handleExpand = () => this.setState({ expanded: !this.state.expanded });

  register = () => {
    const { voter } = this.props;
    if (voter.publicKey) {
      return (
        <FormattedMessage {...messages.registered} />
      );
    }
    return (
      <FormattedMessage {...messages.unregistered} />
    );
  };

  render() {
    const {
      classes,
      bId,
      voter,
      disabled,
    } = this.props;

    const makeUrl = () => `${window.location.protocol}//${window.location.host}/app/vreg/${bId}/${voter.iCode}`;

    return (
      <Card className={classes.card}>
        <CardHeader
          title={voter.name}
          subheader={this.register()}
        />
        <CardContent>
          <Typography component="p">
            {voter.comment}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          {!disabled && (
            <IconButton onClick={this.props.onDelete}>
              <Delete />
            </IconButton>
          )}
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpand}
          >
            <ExpandMore />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Typography component="p" className={classes.detailWrapper}>
            <Typography type="caption" className={classes.detailTitle}>
              <FormattedMessage {...messages.iCode} />
            </Typography>
            {voter.publicKey && (
              <span className={classes.detail}>{voter.iCode}</span>
            )}
            {!voter.publicKey && (
              <a href={makeUrl()}>
                <span className={classes.detail}>{voter.iCode}</span>
              </a>
            )}
          </Typography>
          {!voter.publicKey && (
            <div className={classes.qrcode}>
              <QRCode value={makeUrl()} size={256} />
            </div>
          )}
          {voter.publicKey && (
            <Typography component="p" className={classes.detailWrapper}>
              <Typography type="caption" className={classes.detailTitle}>
                <FormattedMessage {...messages.publicKey} />
              </Typography>
              <span className={classes.detail}>{voter.publicKey}</span>
            </Typography>
          )}
        </Collapse>
      </Card>
    );
  }
}

VoterCard.propTypes = {
  bId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  voter: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  onDelete: PropTypes.func,
};

VoterCard.defaultProps = {
  disabled: false,
};

export const styledVoterCard = withStyles(styles)(VoterCard);

export default styledVoterCard;
