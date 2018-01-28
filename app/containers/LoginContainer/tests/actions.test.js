import * as LOGIN_CONTAINER from '../constants';

import * as loginContainerActions from '../actions';

describe('LoginContainer actions', () => {
  // Actions
  describe('submitLogin action', () => {
    it('has a type of SUBMIT_LOGIN_ACTION', () => {
      expect(loginContainerActions.submitLogin().type).toEqual(LOGIN_CONTAINER.SUBMIT_LOGIN_ACTION);
    });
  });

  describe('submitRegister action', () => {
    it('has a type of SUBMIT_REGISTER_ACTION', () => {
      expect(loginContainerActions.submitRegister().type).toEqual(LOGIN_CONTAINER.SUBMIT_REGISTER_ACTION);
    });
  });

  describe('changeActiveId action', () => {
    it('has a type of CHANGE_ACTIVE_ID_ACTION', () => {
      expect(loginContainerActions.changeActiveId().type).toEqual(LOGIN_CONTAINER.CHANGE_ACTIVE_ID_ACTION);
    });
  });
});
