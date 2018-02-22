import * as LOGIN_CONTAINER from '../constants';
import * as loginContainerActions from '../actions';

describe('LoginContainer actions', () => {
  // Actions
  describe('changeActiveId action', () => {
    it('has a type of CHANGE_ACTIVE_ID_ACTION', () => {
      expect(loginContainerActions.changeActiveId().type).toEqual(LOGIN_CONTAINER.CHANGE_ACTIVE_ID_ACTION);
    });

    it('should forward', () => {
      expect(loginContainerActions.changeActiveId(1).value).toEqual(1);
    });
  });
});
