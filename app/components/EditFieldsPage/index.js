import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import * as Permission from 'utils/permission';

import {
  withStyles,
  Button,
  IconButton,
  Card,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui';
import { Clear, Save, Add, Edit, Delete } from 'material-ui-icons';
import BallotMeta from 'components/BallotMeta';
import LoadingButton from 'components/LoadingButton';
import RefreshButton from 'components/RefreshButton';
import ResultIndicator from 'components/ResultIndicator';
import EmptyIndicator from 'components/EmptyIndicator';
import EditFieldDialog from 'components/EditFieldDialog';
import ReorderableList from 'components/ReorderableList';
import ReorderableListItem from 'components/ReorderableListItem';

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
                color="secondary"
                disabled={isLoading}
                onClick={this.props.onRefresh}
              >
                <FormattedMessage {...messages.drop} />
                <Clear className={classes.rightIcon} />
              </Button>
            </LoadingButton>
          )}
          {!isPristine && (
            <LoadingButton {...{ isLoading }}>
              <Button
                color="primary"
                raised
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
              raised
              onClick={this.props.onStartCreateAction}
            >
              <FormattedMessage {...messages.create} />
              <Add className={classes.rightIcon} />
            </Button>
          )}
        </div>
        <ResultIndicator error={this.props.error} />
        <EditFieldDialog
          isOpen={isOpen}
          isCreate={this.props.isCreate}
          onCancel={this.props.onCancelDialogAction}
          onSubmit={this.props.onSubmitDialogAction}
        />
        <EmptyIndicator isLoading={isLoading} list={ballot && fields} />
        {!isLoading && ballot && fields && (
          <ReorderableList>
            {fields.map((f, i) => (
              <ReorderableListItem
                onReorder={this.props.onReorderAction}
                key={f.key}
                index={i}
              >
                <Card>
                  <ListItem>
                    <ListItemText
                      primary={f.prompt}
                      secondary={makeFieldType(f)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton>
                        <Edit onClick={this.handleEdit(i)} />
                      </IconButton>
                      <IconButton>
                        <Delete onClick={this.handleDelete(i)} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Card>
              </ReorderableListItem>
            ))}
          </ReorderableList>
        )}
      </div>
    );
  }
}

EditFieldsPage.propTypes = {
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

export default styledEditFieldsPage;
