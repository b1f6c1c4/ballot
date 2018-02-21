import * as EDIT_FIELDS_CONTAINER from '../constants';

import * as editFieldsContainerActions from '../actions';

describe('EditFieldsContainer actions', () => {
  // Actions
  describe('remove action', () => {
    const param = { index: 1 };

    it('has a type of REMOVE_ACTION', () => {
      expect(editFieldsContainerActions.remove(param).type).toEqual(EDIT_FIELDS_CONTAINER.REMOVE_ACTION);
    });

    it('should forward params', () => {
      expect(editFieldsContainerActions.remove(param).index).toEqual(1);
    });
  });

  describe('reorder action', () => {
    const param = { from: 1, to: 2 };

    it('has a type of REORDER_ACTION', () => {
      expect(editFieldsContainerActions.reorder(param).type).toEqual(EDIT_FIELDS_CONTAINER.REORDER_ACTION);
    });

    it('should forward params', () => {
      expect(editFieldsContainerActions.reorder(param).from).toEqual(1);
      expect(editFieldsContainerActions.reorder(param).to).toEqual(2);
    });
  });

  describe('startEdit action', () => {
    const param = { index: 1 };

    it('has a type of START_EDIT_ACTION', () => {
      expect(editFieldsContainerActions.startEdit(param).type).toEqual(EDIT_FIELDS_CONTAINER.START_EDIT_ACTION);
    });

    it('should forward params', () => {
      expect(editFieldsContainerActions.startEdit(param).index).toEqual(1);
    });
  });

  describe('startCreate action', () => {
    it('has a type of START_CREATE_ACTION', () => {
      expect(editFieldsContainerActions.startCreate().type).toEqual(EDIT_FIELDS_CONTAINER.START_CREATE_ACTION);
    });
  });

  describe('cancelDialog action', () => {
    it('has a type of CANCEL_DIALOG_ACTION', () => {
      expect(editFieldsContainerActions.cancelDialog().type).toEqual(EDIT_FIELDS_CONTAINER.CANCEL_DIALOG_ACTION);
    });
  });

  describe('submitDialog action', () => {
    const field = { key: 'val' };
    const param = { field };

    it('has a type of SUBMIT_DIALOG_ACTION', () => {
      expect(editFieldsContainerActions.submitDialog(param).type).toEqual(EDIT_FIELDS_CONTAINER.SUBMIT_DIALOG_ACTION);
    });

    it('should forward params', () => {
      expect(editFieldsContainerActions.submitDialog(param).field).toEqual(field);
    });
  });

  describe('statusRequest action', () => {
    it('has a type of STATUS_REQUEST_ACTION', () => {
      expect(editFieldsContainerActions.statusRequest().type).toEqual(EDIT_FIELDS_CONTAINER.STATUS_REQUEST_ACTION);
    });
  });
});
