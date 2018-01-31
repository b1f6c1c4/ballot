import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl'; // eslint-disable-line no-unused-vars
import * as Permission from 'utils/permission';

import {
  withStyles,
} from 'material-ui';
import BallotMeta from 'components/BallotMeta/Loadable';
import LoadingButton from 'components/LoadingButton/Loadable';
import RefreshButton from 'components/RefreshButton/Loadable';
import ResultIndicator from 'components/ResultIndicator/Loadable';
import EmptyIndicator from 'components/EmptyIndicator/Loadable';
import VoterCard from 'components/VoterCard/Loadable';

import messages from './messages'; // eslint-disable-line no-unused-vars

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cards: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
});

class EditVotersPage extends React.PureComponent {
  componentDidMount() {
    this.props.onRefresh();
  }

  handleDelete = (iCode) => () => this.props.onDeleteVoter(iCode);

  render() {
    const {
      classes,
      bId,
      isLoading,
      ballot,
      voters,
    } = this.props;

    const canEditVoters = ballot && Permission.CanEditVoters(ballot);

    return (
      <div className={classes.container}>
        <BallotMeta
          {...{
            onPush: this.props.onPush,
            bId,
            ballot,
            isLoading,
          }}
        />
        <div className={classes.actions}>
          <LoadingButton {...{ isLoading }}>
            <RefreshButton
              isLoading={isLoading}
              onClick={this.props.onRefresh}
            />
          </LoadingButton>
        </div>
        <ResultIndicator error={this.props.error} />
        <EmptyIndicator isLoading={isLoading} list={voters && voters} />
        <div className={classes.cards}>
          {!isLoading && voters && voters.map((v) => (
            <VoterCard
              key={v.iCode}
              voter={v}
              disabled={!canEditVoters}
              onDelete={this.handleDelete(v.iCode)}
              {...{ bId }}
            />
          ))}
        </div>
      </div>
    );
  }
}

EditVotersPage.propTypes = {
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  voters: PropTypes.array,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onDeleteVoter: PropTypes.func.isRequired,
};

export const styledEditVotersPage = withStyles(styles)(EditVotersPage);

export default styledEditVotersPage;
