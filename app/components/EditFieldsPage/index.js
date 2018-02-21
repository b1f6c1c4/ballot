import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import * as Permission from 'utils/permission';

import {
  withStyles,
  IconButton,
  Card,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui';
import {
  Clear,
  Save,
  Add,
  Edit,
  Visibility,
  Delete,
} from 'material-ui-icons';
import Button from 'components/Button';
import LeavePrompt from 'components/LeavePrompt';
import BallotMeta from 'components/BallotMeta';
import LoadingButton from 'components/LoadingButton';
import RefreshButton from 'components/RefreshButton';
import ResultIndicator from 'components/ResultIndicator';
import EmptyIndicator from 'components/EmptyIndicator';
import EditFieldDialog from 'components/EditFieldDialog';
import ReorderableList from 'components/ReorderableList';
import ReorderableListItem from 'components/ReorderableListItem';
import ConfirmDialog from 'components/ConfirmDialog';

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
  reorder: {
    cursor: 'ns-resize',
    flex: 1,
  },
});

class EditFieldsPage extends React.PureComponent {
  state = {
    isOpenDrop: false,
    isOpenDelete: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.bId, this.props.bId)) {
      this.handleConfirm()();
    }
  }

  handleConfirm = (ac) => () => {
    if (_.isString(ac)) {
      this.setState(_.assign({}, this.state, { [ac]: true }));
      return;
    }
    if (_.isFunction(ac)) {
      ac();
    }
    this.setState(_.mapValues(this.state, (v, k) => /^isOpen/.test(k) ? false : v));
  };

  handleEdit = (index) => () => this.props.onStartEditAction({ index });

  handleDelete = (index) => () => this.props.onRemoveAction({ index });

  render() {
    const {
      classes,
      bId,
      isLoading,
      isPristine,
      isOpen,
      ballot,
      fields,
    } = this.props;

    const canEditFields = ballot && Permission.CanEditFields(ballot);

    const makeFieldType = (b) => {
      const { type } = b; // eslint-disable-line no-underscore-dangle
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
        <LeavePrompt isPristine={isPristine} />
        <div className={classes.actions}>
          {isPristine && (
            <LoadingButton {...{ isLoading }}>
              <RefreshButton
                isLoading={isLoading}
                onClick={this.props.onRefresh}
              />
            </LoadingButton>
          )}
          {!isPristine && (
            <LoadingButton {...{ isLoading }}>
              <Button
                color="primary"
                disabled={isLoading}
                onClick={this.props.onSave}
              >
                <FormattedMessage {...messages.save} />
                <Save className={classes.rightIcon} />
              </Button>
            </LoadingButton>
          )}
          {!isLoading && canEditFields && (
            <Button
              color="primary"
              variant="raised"
              onClick={this.props.onStartCreateAction}
            >
              <FormattedMessage {...messages.create} />
              <Add className={classes.rightIcon} />
            </Button>
          )}
          {!isPristine && (
            <LoadingButton {...{ isLoading }}>
              <Button
                color="secondary"
                disabled={isLoading}
                onClick={this.handleConfirm('isOpenDrop')}
              >
                <FormattedMessage {...messages.drop} />
                <Clear className={classes.rightIcon} />
              </Button>
            </LoadingButton>
          )}
          <ConfirmDialog
            title={messages.dropTitle}
            description={messages.dropDescription}
            isOpen={this.state.isOpenDrop}
            onCancel={this.handleConfirm()}
            onAction={this.handleConfirm(this.props.onRefresh)}
          />
        </div>
        <ResultIndicator error={this.props.error} />
        <EditFieldDialog
          isOpen={isOpen}
          disabled={!canEditFields}
          isCreate={this.props.isCreate}
          onCancel={this.props.onCancelDialogAction}
          onSubmit={this.props.onSubmitDialogAction}
        />
        <EmptyIndicator isLoading={isLoading} list={ballot && fields} />
        {!isLoading && ballot && fields && (
          <ReorderableList>
            {fields.map((f, i) => (
              <Card>
                <ListItem>
                  <ReorderableListItem
                    onReorder={this.props.onReorderAction}
                    key={f.key}
                    index={i}
                    disabled={!canEditFields}
                  >
                    <div
                      className={classes.reorder}
                    >
                      <ListItemText
                        primary={f.prompt}
                        secondary={makeFieldType(f)}
                      />
                    </div>
                  </ReorderableListItem>
                  <ListItemSecondaryAction>
                    <IconButton>
                      {canEditFields && (
                        <Edit onClick={this.handleEdit(i)} />
                      )}
                      {!canEditFields && (
                        <Visibility onClick={this.handleEdit(i)} />
                      )}
                    </IconButton>
                    {canEditFields && (
                      <IconButton>
                        <Delete onClick={this.handleConfirm('isOpenDelete')} />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                  <ConfirmDialog
                    title={messages.deleteTitle}
                    description={messages.deleteDescription}
                    isOpen={this.state.isOpenDelete}
                    onCancel={this.handleConfirm()}
                    onAction={this.handleConfirm(this.handleDelete(i))}
                  />
                </ListItem>
              </Card>
            ))}
          </ReorderableList>
        )}
      </div>
    );
  }
}

EditFieldsPage.propTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isCreate: PropTypes.bool.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  fields: PropTypes.array,
  onRefresh: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemoveAction: PropTypes.func.isRequired,
  onReorderAction: PropTypes.func.isRequired,
  onStartEditAction: PropTypes.func.isRequired,
  onStartCreateAction: PropTypes.func.isRequired,
  onCancelDialogAction: PropTypes.func.isRequired,
  onSubmitDialogAction: PropTypes.func.isRequired,
};

export const styledEditFieldsPage = withStyles(styles)(EditFieldsPage);

export default injectIntl(styledEditFieldsPage);
