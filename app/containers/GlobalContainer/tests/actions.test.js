import * as GLOBAL_CONTAINER from '../constants';

import * as globalContainerActions from '../actions';

describe('GlobalContainer actions', () => {
  // Actions
  describe('openDrawer action', () => {
    it('has a type of OPEN_DRAWER_ACTION', () => {
      expect(globalContainerActions.openDrawer().type).toEqual(GLOBAL_CONTAINER.OPEN_DRAWER_ACTION);
    });
  });

  describe('closeDrawer action', () => {
    it('has a type of CLOSE_DRAWER_ACTION', () => {
      expect(globalContainerActions.closeDrawer().type).toEqual(GLOBAL_CONTAINER.CLOSE_DRAWER_ACTION);
    });
  });

  describe('openAccount action', () => {
    it('has a type of OPEN_ACCOUNT_ACTION', () => {
      expect(globalContainerActions.openAccount().type).toEqual(GLOBAL_CONTAINER.OPEN_ACCOUNT_ACTION);
    });
  });

  describe('closeAccount action', () => {
    it('has a type of CLOSE_ACCOUNT_ACTION', () => {
      expect(globalContainerActions.closeAccount().type).toEqual(GLOBAL_CONTAINER.CLOSE_ACCOUNT_ACTION);
    });
  });

  describe('login action', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFzZGZxd2VyIiwiaWF0IjoxNTE3MjkxOTU0LCJleHAiOjE1MTcyOTkxNTQsImF1ZCI6ImJhbGxvdCIsImlzcyI6ImJhbGxvdCJ9.b4GJr0ESDFIQAWsKCizurdrx7C3tpo9J0aN90PgO_Mc';

    it('has a type of LOGIN_ACTION', () => {
      expect(globalContainerActions.login(token).type).toEqual(GLOBAL_CONTAINER.LOGIN_ACTION);
    });

    it('should forward credential', () => {
      const credential = {
        token,
        username: 'asdfqwer',
        iat: 1517291954,
        exp: 1517299154,
        aud: 'ballot',
        iss: 'ballot',
      };
      expect(globalContainerActions.login(token).credential).toEqual(credential);
    });
  });

  describe('logout action', () => {
    it('has a type of LOGOUT_ACTION', () => {
      expect(globalContainerActions.logout().type).toEqual(GLOBAL_CONTAINER.LOGOUT_ACTION);
    });
  });
});
