import * as GLOBAL from '../constants';

import * as globalActions from '../actions';

describe('Global actions', () => {
  // Actions
  describe('toggleDrawerOpen action', () => {
    it('has a type of TOGGLE_DRAWER_OPEN_ACTION', () => {
      expect(globalActions.toggleDrawerOpen().type).toEqual(GLOBAL.TOGGLE_DRAWER_OPEN_ACTION);
    });
  });

  describe('updateCredential action', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM4NjAxNzUsImV4cCI6MTUxMzg2NzM3NSwiYXVkIjoidHJ5LXJlYWN0IiwiaXNzIjoidHJ5LXJlYWN0In0.Y6li_4xDg4dQALJKFqUp0NxXjUH1skPEIg41Z0aN9LE';

    it('has a type of UPDATE_CREDENTIAL_ACTION', () => {
      expect(globalActions.updateCredential(token).type).toEqual(GLOBAL.UPDATE_CREDENTIAL_ACTION);
    });

    it('should forward credential', () => {
      const credential = {
        token,
        iat: 1513860175,
        exp: 1513867375,
        aud: 'try-react',
        iss: 'try-react',
      };
      expect(globalActions.updateCredential(token).credential).toEqual(credential);
    });
  });
});
