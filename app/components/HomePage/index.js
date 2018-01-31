import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from 'material-ui';
import Loading from 'components/Loading';
import Abbreviation from 'components/Abbreviation/Loadable';
import LoadingButton from 'components/LoadingButton/Loadable';
import RefreshButton from 'components/RefreshButton/Loadable';
import StatusBadge from 'components/StatusBadge/Loadable';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  title: {
    margin: theme.spacing.unit,
    flex: 1,
  },
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
    justifyContent: 'flex-end',
  },
  empty: {
    textAlign: 'center',
  },
});

class HomePage extends React.PureComponent {
  handleCreate = () => this.props.onPush('/app/create');

  handleClick = (bId) => () => this.props.onPush(`/app/ballots/${bId}`);

  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes, isLoading, listBallots } = this.props;

    return (
      <div className={classes.container}>
        <Typography type="display2">
          <FormattedMessage {...messages.header} />
        </Typography>
        <Paper className={classes.root}>
          <div className={classes.actions}>
            <Typography type="title" className={classes.title}>
              <FormattedMessage {...messages.listBallots} />
            </Typography>
            <LoadingButton {...{ isLoading }}>
              <RefreshButton
                isLoading={isLoading}
                onClick={this.props.onRefreshListBallots}
              />
            </LoadingButton>
          </div>
          {!isLoading && listBallots && listBallots.length > 0 && (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell padding="none"><FormattedMessage {...messages.bId} /></TableCell>
                  <TableCell padding="none"><FormattedMessage {...messages.name} /></TableCell>
                  <TableCell padding="none"><FormattedMessage {...messages.status} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listBallots.map((b) => (
                  <TableRow key={b.bId} hover onClick={this.handleClick(b.bId)}>
                    <TableCell padding="none">
                      <Abbreviation text={b.bId} />
                    </TableCell>
                    <TableCell padding="none">{b.name}</TableCell>
                    <TableCell padding="none"><StatusBadge status={b.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && !(listBallots && listBallots.length) && (
            <Typography type="display1" className={classes.empty}>
              <FormattedMessage {...messages.empty} />
            </Typography>
          )}
          {isLoading && (
            <Loading />
          )}
          <div className={classes.actions}>
            <LoadingButton>
              <Button
                color="secondary"
                raised
                onClick={this.handleCreate}
              >
                <FormattedMessage {...messages.create} />
              </Button>
            </LoadingButton>
          </div>
        </Paper>
      </div>
    );
  }
}

HomePage.propTypes = {
  onPush: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  listBallots: PropTypes.array,
  onRefreshListBallots: PropTypes.func.isRequired,
};

export const styledHomePage = withStyles(styles)(HomePage);

export default styledHomePage;
