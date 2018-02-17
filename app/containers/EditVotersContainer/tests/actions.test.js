import * as VIEW_BALLOT_CONTAINER from '../constants';

import * as editVotersContainerActions from '../actions';

describe('EditVotersContainer actions', () => {
  // Actions
  describe('voterRgRequest action', () => {
    const param = { bId: 'b' };

    it('has a type of VOTER_RG_REQUEST_ACTION', () => {
      expect(editVotersContainerActions.voterRgRequest(param).type).toEqual(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION);
    });

    it('should forward', () => {
      expect(editVotersContainerActions.voterRgRequest(param).bId).toEqual('b');
    });
  });

  describe('voterRgStop action', () => {
    it('has a type of VOTER_RG_STOP_ACTION', () => {
      expect(editVotersContainerActions.voterRgStop().type).toEqual(VIEW_BALLOT_CONTAINER.VOTER_RG_STOP_ACTION);
    });
  });

  describe('voterRegistered action', () => {
    const param = { iCode: 'c' };

    it('has a type of VOTER_REGISTERED_ACTION', () => {
      expect(editVotersContainerActions.voterRegistered('b', param).type).toEqual(VIEW_BALLOT_CONTAINER.VOTER_REGISTERED_ACTION);
    });

    it('should forward', () => {
      expect(editVotersContainerActions.voterRegistered('b', param).bId).toEqual('b');
      expect(editVotersContainerActions.voterRegistered('b', param).voter).toEqual(param);
    });
  });
});
