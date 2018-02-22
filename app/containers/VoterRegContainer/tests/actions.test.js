import * as VOTER_REG_CONTAINER from '../constants';
import * as voterRegContainerActions from '../actions';

describe('VoterRegContainer actions', () => {
  // Actions
  describe('statusRequest action', () => {
    it('has a type of STATUS_REQUEST_ACTION', () => {
      expect(voterRegContainerActions.statusRequest().type).toEqual(VOTER_REG_CONTAINER.STATUS_REQUEST_ACTION);
    });
  });
});
