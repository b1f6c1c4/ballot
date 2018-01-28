import * as LOGIN_PAGE from '../constants';

import * as loginContainerActions from '../actions';

describe('LoginContainer actions', () => {
  // Actions
  describe('submitLogin action', () => {
    it('has a type of SUBMIT_LOGIN_ACTION', () => {
      expect(loginContainerActions.submitLogin().type).toEqual(LOGIN_PAGE.SUBMIT_LOGIN_ACTION);
    });
  });
});
