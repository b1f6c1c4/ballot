import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
  Typography,
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from 'material-ui';
import Loading from 'components/Loading';
import EmptyIndicator from 'components/EmptyIndicator/Loadable';
import Abbreviation from 'components/Abbreviation/Loadable';
import LoadingButton from 'components/LoadingButton/Loadable';
import ViewButton from 'components/ViewButton/Loadable';
import EditButton from 'components/EditButton/Loadable';
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
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    margin: theme.spacing.unit,
    minWidth: 280,
    flexGrow: 1,
  },
});

class ViewBallotPage extends React.PureComponent {
  componentDidMount() {
    this.handleRefresh();
  }

  handleRefresh = () => this.props.onRefresh(this.props.bId);

  handleFieldsEdit = () => {
    const { bId } = this.props;
    this.props.onPush(`/app/ballots/${bId}/fields`);
  };

  handleVotersEdit = () => {
    const { bId } = this.props;
    this.props.onPush(`/app/ballots/${bId}/voters`);
  };

  render() {
    const {
      intl, // eslint-disable-line no-unused-vars
      classes,
      bId,
      isLoading,
      ballot,
    } = this.props;

    let canEditFields;
    let canEditVoters;
    let canViewStats;
    if (ballot) {
      switch (ballot.status) {
        case 'creating':
        case 'inviting':
        case 'invited':
          canEditFields = true;
          break;
        default:
          canEditFields = false;
          break;
      }
      switch (ballot.status) {
        case 'inviting':
          canEditVoters = true;
          break;
        default:
          canEditVoters = false;
          break;
      }
      switch (ballot.status) {
        case 'voting':
        case 'finished':
          canViewStats = true;
          break;
        default:
          canViewStats = false;
          break;
      }
    }

    const makeFieldType = (b) => {
      const type = b.__typename; // eslint-disable-line no-underscore-dangle
      const key = `fieldType_${type}`;
      if (messages[key]) {
        return (
          <FormattedMessage {...messages[key]} />
        );
      }
      return (
        <span>{type}</span>
      );
    };

    const makeVoterReg = (b) => {
      if (b.publicKey) {
        return (
          <FormattedMessage {...messages.registered} />
        );
      }
      return (
        <FormattedMessage {...messages.unregistered} />
      );
    };

    return (
      <div className={classes.container}>
        {!isLoading && ballot && (
          <Typography type="display2" gutterBottom>
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
        <div className={classes.actions}>
          <LoadingButton {...{ isLoading }}>
            <RefreshButton
              isLoading={isLoading}
              onClick={this.handleRefresh}
            />
          </LoadingButton>
        </div>
        <div className={classes.cards}>
          <Card className={classes.card}>
            <CardContent>
              <Typography type="subheading">
                <FormattedMessage {...messages.fields} />
              </Typography>
              <EmptyIndicator isLoading={isLoading} list={ballot && ballot.fields} />
              {!isLoading && ballot && ballot.fields && (
                <Table>
                  <TableBody>
                    {ballot.fields.map((b) => (
                      <TableRow>
                        <TableCell>{b.prompt}</TableCell>
                        <TableCell>{makeFieldType(b)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardActions>
              {canEditFields && (
                <EditButton onClick={this.handleFieldsEdit} />
              )}
              {!canEditFields && (
                <ViewButton onClick={this.handleFieldsEdit} />
              )}
            </CardActions>
          </Card>
          <Card className={classes.card}>
            <CardContent>
              <Typography type="subheading">
                <FormattedMessage {...messages.voters} />
              </Typography>
              <EmptyIndicator isLoading={isLoading} list={ballot && ballot.voters} />
              {!isLoading && ballot && ballot.voters && (
                <Table>
                  <TableBody>
                    {ballot.voters.map((b) => (
                      <TableRow>
                        <TableCell>{b.name}</TableCell>
                        <TableCell>{makeVoterReg(b)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardActions>
              {canEditVoters && (
                <EditButton onClick={this.handleVotersEdit} />
              )}
              {!canEditVoters && (
                <ViewButton onClick={this.handleVotersEdit} />
              )}
            </CardActions>
          </Card>
          {canViewStats && (
            <Card className={classes.card}>
              <CardContent>
                <Typography type="subheading">
                  <FormattedMessage {...messages.stats} />
                </Typography>
                <EmptyIndicator isLoading={isLoading} />
              </CardContent>
              <CardActions>
                <ViewButton onClick={this.handleStatView} />
              </CardActions>
            </Card>
          )}
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
