import * as SUBSCRIPTION_CONTAINER from '../constants';

import * as subscriptionContainerActions from '../actions';

describe('SubscriptionContainer actions', () => {
  // Actions
  describe('statusChange action', () => {
    const param = { bId: 'b', status: 's' };

    it('has a type of STATUS_CHANGE_ACTION', () => {
      expect(subscriptionContainerActions.statusChange(param).type).toEqual(SUBSCRIPTION_CONTAINER.STATUS_CHANGE_ACTION);
    });

    it('should forward', () => {
      expect(subscriptionContainerActions.statusChange(param).bId).toEqual('b');
      expect(subscriptionContainerActions.statusChange(param).status).toEqual('s');
    });
  });

  describe('statusStop action', () => {
    it('has a type of STATUS_STOP_ACTION', () => {
      expect(subscriptionContainerActions.statusStop().type).toEqual(SUBSCRIPTION_CONTAINER.STATUS_STOP_ACTION);
    });
  });

  describe('statusRequest action', () => {
    it('has a type of STATUS_REQUEST_ACTION', () => {
      expect(subscriptionContainerActions.statusRequest().type).toEqual(SUBSCRIPTION_CONTAINER.STATUS_REQUEST_ACTION);
    });
  });
});
