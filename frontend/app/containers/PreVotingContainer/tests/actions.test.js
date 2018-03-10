import * as PRE_VOTING_CONTAINER from '../constants';
import * as preVotingContainerActions from '../actions';

describe('PreVotingContainer actions', () => {
  // Actions
  describe('statusRequest action', () => {
    it('has a type of STATUS_REQUEST_ACTION', () => {
      expect(preVotingContainerActions.statusRequest().type).toEqual(PRE_VOTING_CONTAINER.STATUS_REQUEST_ACTION);
    });
  });

  describe('signProgress action', () => {
    it('has a type of SIGN_PROGRESS_ACTION', () => {
      expect(preVotingContainerActions.signProgress().type).toEqual(PRE_VOTING_CONTAINER.SIGN_PROGRESS_ACTION);
    });

    it('should forward', () => {
      expect(preVotingContainerActions.signProgress(1).progress).toEqual(1);
    });
  });
});
