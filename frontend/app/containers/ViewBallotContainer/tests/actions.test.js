import * as VIEW_BALLOT_CONTAINER from '../constants';

import * as viewBallotContainerActions from '../actions';

describe('ViewBallotContainer actions', () => {
  // Actions
  describe('voterRgRequest action', () => {
    const param = { bId: 'b' };

    it('has a type of VOTER_RG_REQUEST_ACTION', () => {
      expect(viewBallotContainerActions.voterRgRequest(param).type).toEqual(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION);
    });

    it('should forward', () => {
      expect(viewBallotContainerActions.voterRgRequest(param).bId).toEqual('b');
    });
  });

  describe('voterRgStop action', () => {
    it('has a type of VOTER_RG_STOP_ACTION', () => {
      expect(viewBallotContainerActions.voterRgStop().type).toEqual(VIEW_BALLOT_CONTAINER.VOTER_RG_STOP_ACTION);
    });
  });

  describe('voterRegistered action', () => {
    const param = { bId: 'b', iCode: 'c' };

    it('has a type of VOTER_REGISTERED_ACTION', () => {
      expect(viewBallotContainerActions.voterRegistered(param).type).toEqual(VIEW_BALLOT_CONTAINER.VOTER_REGISTERED_ACTION);
    });

    it('should forward', () => {
      expect(viewBallotContainerActions.voterRegistered(param).bId).toEqual('b');
      expect(viewBallotContainerActions.voterRegistered(param).iCode).toEqual('c');
    });
  });
});
