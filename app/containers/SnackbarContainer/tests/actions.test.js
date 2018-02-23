import * as SNACKBAR_CONTAINER from '../constants';
import * as snackbarContainerActions from '../actions';

describe('SnackbarContainer actions', () => {
  // Actions
  describe('snackbarRequest action', () => {
    const param = { k: 'v' };

    it('has a type of SNACKBAR_REQUEST_ACTION', () => {
      expect(snackbarContainerActions.snackbarRequest(param).type).toEqual(SNACKBAR_CONTAINER.SNACKBAR_REQUEST_ACTION);
    });

    it('should forward', () => {
      expect(snackbarContainerActions.snackbarRequest(param).message).toEqual(param);
    });
  });

  describe('snackbarShow action', () => {
    const param = { k: 'v' };

    it('has a type of SNACKBAR_SHOW_ACTION', () => {
      expect(snackbarContainerActions.snackbarShow(param).type).toEqual(SNACKBAR_CONTAINER.SNACKBAR_SHOW_ACTION);
    });

    it('should forward', () => {
      expect(snackbarContainerActions.snackbarShow(param).message).toEqual(param);
    });
  });

  describe('snackbarHide action', () => {
    it('has a type of SNACKBAR_HIDE_ACTION', () => {
      expect(snackbarContainerActions.snackbarHide().type).toEqual(SNACKBAR_CONTAINER.SNACKBAR_HIDE_ACTION);
    });
  });
});
