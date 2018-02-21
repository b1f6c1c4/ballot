import * as VIEW_BALLOT_CONTAINER from '../constants';

import * as viewBallotContainerActions from '../actions';

describe('ViewBallotContainer actions', () => {
  // Actions
  describe('statusRequest action', () => {
    it('has a type of STATUS_REQUEST_ACTION', () => {
      expect(viewBallotContainerActions.statusRequest().type).toEqual(VIEW_BALLOT_CONTAINER.STATUS_REQUEST_ACTION);
    });
  });

  describe('voterRgRequest action', () => {
    it('has a type of VOTER_RG_REQUEST_ACTION', () => {
      expect(viewBallotContainerActions.voterRgRequest().type).toEqual(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION);
    });
  });
});
