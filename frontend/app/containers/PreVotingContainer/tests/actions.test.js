import * as PRE_VOTING_CONTAINER from '../constants';

import * as preVotingContainerActions from '../actions';

describe('PreVotingContainer actions', () => {
  // Actions
  describe('statusRequest action', () => {
    it('has a type of STATUS_REQUEST_ACTION', () => {
      expect(preVotingContainerActions.statusRequest().type).toEqual(PRE_VOTING_CONTAINER.STATUS_REQUEST_ACTION);
    });
  });
});
