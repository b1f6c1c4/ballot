import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import * as Permission from 'utils/permission';

import {
  withStyles,
  Typography,
} from 'material-ui';
import BallotMeta from 'components/BallotMeta/Loadable';
import LoadingButton from 'components/LoadingButton/Loadable';
import RefreshButton from 'components/RefreshButton/Loadable';
import VoterCard from 'components/VoterCard/Loadable';

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
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

class EditVotersPage extends React.PureComponent {
  componentDidMount() {
    this.handleRefresh();
  }

  handleRefresh = () => this.props.onRefresh(this.props.bId);

  render() {
    const {
      classes,
      onPush,
      bId,
      isLoading,
      ballot,
      voters,
    } = this.props;

    const canEditVoters = ballot && Permission.CanEditVoters(ballot);

    return (
      <div className={classes.container}>
        <BallotMeta {...{ onPush, bId, ballot, isLoading }} />
        <div className={classes.actions}>
          <LoadingButton {...{ isLoading }}>
            <RefreshButton
              isLoading={isLoading}
              onClick={this.handleRefresh}
            />
          </LoadingButton>
        </div>
        <div className={classes.cards}>
        </div>
      </div>
    )
  }
}

EditVotersPage.propTypes = {
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  voters: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export const styledEditVotersPage = withStyles(styles)(EditVotersPage);

export default styledEditVotersPage;
