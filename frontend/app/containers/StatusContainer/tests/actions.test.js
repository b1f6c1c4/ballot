import * as STATUS_PAGE from '../constants';

import * as statusContainerActions from '../actions';

describe('StatusContainer actions', () => {
  // Actions
  describe('fetchStatus action', () => {
    it('has a type of FETCH_STATUS_ACTION', () => {
      expect(statusContainerActions.fetchStatus().type).toEqual(STATUS_PAGE.FETCH_STATUS_ACTION);
    });
  });
});
