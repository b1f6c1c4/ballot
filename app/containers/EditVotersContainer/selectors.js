import { createSelector } from 'reselect';

export const makeSelectEditVotersContainerVoters = () => createSelector(
  (state) => state.getIn(['editVotersContainer', 'voters']),
  (state) => state && state.toJS(),
);

export const makeSelectEditVotersContainerBallot = () => createSelector(
  (state) => state.getIn(['editVotersContainer', 'ballot']),
  (state) => state && state.toJS(),
);

export const makeSelectEditVotersContainerError = () => createSelector(
  (state) => state.getIn(['editVotersContainer', 'error']),
  (state) => state && state.toJS(),
);
