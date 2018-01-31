import { createSelector } from 'reselect';

export const makeSelectViewBallotContainerBallot = () => createSelector(
  (state) => state.getIn(['viewBallotContainer', 'ballot']),
  (state) => state && state.toJS(),
);

export const makeSelectViewBallotContainerError = () => createSelector(
  (state) => state.getIn(['viewBallotContainer', 'error']),
  (state) => state && state.toJS(),
);
