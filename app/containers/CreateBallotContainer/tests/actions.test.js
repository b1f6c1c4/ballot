import * as CREATE_BALLOT_CONTAINER from '../constants';

import * as createBallotContainerActions from '../actions';

describe('CreateBallotContainer actions', () => {
  // Actions
  describe('create action', () => {
    it('has a type of CREATE_ACTION', () => {
      expect(createBallotContainerActions.create().type).toEqual(CREATE_BALLOT_CONTAINER.CREATE_ACTION);
    });
  });
});
