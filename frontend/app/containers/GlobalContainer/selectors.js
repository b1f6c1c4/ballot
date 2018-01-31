import { createSelector } from 'reselect';

export const makeSelectGlobalContainerListBallots = () => createSelector(
  (state) => state.getIn(['globalContainer', 'listBallots']),
  (state) => state && state.toJS(),
);
