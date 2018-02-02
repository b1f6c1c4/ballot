import * as PRE_VOTING_CONTAINER from '../constants';

import * as preVotingContainerActions from '../actions';

describe('PreVotingContainer actions', () => {
  // Actions
  describe('sign action', () => {
    it('has a type of SIGN_ACTION', () => {
      expect(preVotingContainerActions.sign().type).toEqual(PRE_VOTING_CONTAINER.SIGN_ACTION);
    });
  });
});
