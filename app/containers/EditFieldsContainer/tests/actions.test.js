import * as EDIT_FIELDS_CONTAINER from '../constants';

import * as editFieldsContainerActions from '../actions';

describe('EditFieldsContainer actions', () => {
  // Actions
  describe('add action', () => {
    it('has a type of ADD_ACTION', () => {
      expect(editFieldsContainerActions.add().type).toEqual(EDIT_FIELDS_CONTAINER.ADD_ACTION);
    });
  });

  describe('remove action', () => {
    const param = { index: 1 };

    it('has a type of REMOVE_ACTION', () => {
      expect(editFieldsContainerActions.remove(param).type).toEqual(EDIT_FIELDS_CONTAINER.REMOVE_ACTION);
    });

    it('should forward index', () => {
      expect(editFieldsContainerActions.remove(param).index).toEqual(1);
    });
  });

  describe('reorder action', () => {
    it('has a type of REORDER_ACTION', () => {
      expect(editFieldsContainerActions.reorder().type).toEqual(EDIT_FIELDS_CONTAINER.REORDER_ACTION);
    });
  });

  describe('startEdit action', () => {
    it('has a type of START_EDIT_ACTION', () => {
      expect(editFieldsContainerActions.startEdit().type).toEqual(EDIT_FIELDS_CONTAINER.START_EDIT_ACTION);
    });
  });

  describe('cancelEdit action', () => {
    it('has a type of CANCEL_EDIT_ACTION', () => {
      expect(editFieldsContainerActions.cancelEdit().type).toEqual(EDIT_FIELDS_CONTAINER.CANCEL_EDIT_ACTION);
    });
  });

  describe('saveEdit action', () => {
    it('has a type of SAVE_EDIT_ACTION', () => {
      expect(editFieldsContainerActions.saveEdit().type).toEqual(EDIT_FIELDS_CONTAINER.SAVE_EDIT_ACTION);
    });
  });
});
