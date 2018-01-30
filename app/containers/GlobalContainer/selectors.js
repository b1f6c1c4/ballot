import { createSelector } from 'reselect';

export const selectGlobalContainer = (state) => state.get('globalContainer');

export const makeSelectGlobalContainerListBallots = () => createSelector(
  selectGlobalContainer,
  (state) => state.get('listBallots'),
);
