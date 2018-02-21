import * as EDIT_VOTERS_CONTAINER from '../constants';

import * as editVotersContainerActions from '../actions';

describe('EditVotersContainer actions', () => {
  // Actions
  describe('statusRequest action', () => {
    it('has a type of STATUS_REQUEST_ACTION', () => {
      expect(editVotersContainerActions.statusRequest().type).toEqual(EDIT_VOTERS_CONTAINER.STATUS_REQUEST_ACTION);
    });
  });

  describe('voterRgRequest action', () => {
    it('has a type of VOTER_RG_REQUEST_ACTION', () => {
      expect(editVotersContainerActions.voterRgRequest().type).toEqual(EDIT_VOTERS_CONTAINER.VOTER_RG_REQUEST_ACTION);
    });
  });
});
