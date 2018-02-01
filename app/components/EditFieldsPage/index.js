import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import * as Permission from 'utils/permission';

import {
  withStyles,
} from 'material-ui';
import BallotMeta from 'components/BallotMeta';
import LoadingButton from 'components/LoadingButton';
import RefreshButton from 'components/RefreshButton';
import ResultIndicator from 'components/ResultIndicator';
import EmptyIndicator from 'components/EmptyIndicator';
import EditFieldDialog from 'components/EditFieldDialog';

import messages from './messages';

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
});

class EditFieldsPage extends React.PureComponent {
  componentDidMount() {
    this.props.onRefresh();
  }

  render() {
    const {
      classes,
      bId,
      isLoading,
      ballot,
      fields,
    } = this.props;

    const canEditFields = ballot && Permission.CanEditFields(ballot);

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
        <EditFieldDialog
          isOpen
          onCancel={this.props.onCancelEditAction}
          onSubmit={this.props.onSaveEditAction}
        />
        <EmptyIndicator isLoading={isLoading} list={ballot && fields} />
      </div>
    );
  }
}

EditFieldsPage.propTypes = {
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  fields: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onAddAction: PropTypes.func.isRequired,
  onRemoveAction: PropTypes.func.isRequired,
  onReorderAction: PropTypes.func.isRequired,
  onStartEditAction: PropTypes.func.isRequired,
  onCancelEditAction: PropTypes.func.isRequired,
  onSaveEditAction: PropTypes.func.isRequired,
};

export const styledEditFieldsPage = withStyles(styles)(EditFieldsPage);

export default styledEditFieldsPage;
