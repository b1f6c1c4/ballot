import * as VIEW_STAT_CONTAINER from '../constants';

import * as viewStatContainerActions from '../actions';

describe('ViewStatContainer actions', () => {
  // Actions
  describe('changeField action', () => {
    it('has a type of CHANGE_FIELD_ACTION', () => {
      expect(viewStatContainerActions.changeField().type).toEqual(VIEW_STAT_CONTAINER.CHANGE_FIELD_ACTION);
    });
  });
});
