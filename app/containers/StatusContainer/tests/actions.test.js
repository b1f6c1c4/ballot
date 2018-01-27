import * as STATUS_PAGE from '../constants';

import * as statusPageActions from '../actions';

describe('StatusContainer actions', () => {
  // Actions
  describe('fetchStatus action', () => {
    it('has a type of FETCH_STATUS_ACTION', () => {
      expect(statusPageActions.fetchStatus().type).toEqual(STATUS_PAGE.FETCH_STATUS_ACTION);
    });
  });
});
