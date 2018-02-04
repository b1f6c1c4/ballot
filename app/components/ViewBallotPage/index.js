import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import * as Permission from 'utils/permission';

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
  Button,
} from 'material-ui';
import BallotMeta from 'components/BallotMeta';
import LoadingButton from 'components/LoadingButton';
import RefreshButton from 'components/RefreshButton';
import ViewButton from 'components/ViewButton';
import EditButton from 'components/EditButton';
import EmptyIndicator from 'components/EmptyIndicator';
import ResultIndicator from 'components/ResultIndicator';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit,
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
    alignItems: 'flex-start',
  },
  card: {
    margin: theme.spacing.unit,
    minWidth: 280,
    flexGrow: 1,
  },
});

class ViewBallotPage extends React.PureComponent {
  componentDidMount() {
    this.props.onRefresh();
  }

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
      classes,
      bId,
      isLoading,
      ballot,
    } = this.props;

    const canEditFields = ballot && Permission.CanEditFields(ballot);
    const canEditVoters = ballot && Permission.CanEditVoters(ballot);
    const canViewStats = ballot && Permission.CanViewStats(ballot);

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
        <BallotMeta
          {...{
            onPush: this.props.onPush,
            bId,
            ballot,
            isLoading,
            onRefresh: this.props.onRefresh,
          }}
        />
        <div className={classes.actions}>
          <LoadingButton {...{ isLoading }}>
            <RefreshButton
              isLoading={isLoading}
              onClick={this.props.onRefresh}
            />
          </LoadingButton>
          {!isLoading && ballot && ballot.status === 'inviting' && (
            <Button
              color="secondary"
              isLoading={isLoading}
              onClick={this.props.onFinalize}
            >
              <FormattedMessage {...messages.finalizeVoters} />
            </Button>
          )}
          {!isLoading && ballot && ballot.status === 'invited' && (
            <Button
              color="secondary"
              isLoading={isLoading}
              onClick={this.props.onFinalize}
            >
              <FormattedMessage {...messages.finalizeFields} />
            </Button>
          )}
          {!isLoading && ballot && ballot.status === 'preVoting' && (
            <Button
              color="secondary"
              isLoading={isLoading}
              onClick={this.props.onFinalize}
            >
              <FormattedMessage {...messages.finalizePreVoting} />
            </Button>
          )}
          {!isLoading && ballot && ballot.status === 'voting' && (
            <Button
              color="secondary"
              isLoading={isLoading}
              onClick={this.props.onFinalize}
            >
              <FormattedMessage {...messages.finalizeVoting} />
            </Button>
          )}
        </div>
        <ResultIndicator error={this.props.error} />
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
  classes: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onFinalize: PropTypes.func.isRequired,
};

export const styledViewBallotPage = withStyles(styles)(ViewBallotPage);

export default styledViewBallotPage;
