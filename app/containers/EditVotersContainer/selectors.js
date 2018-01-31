import { createSelector } from 'reselect';

export const makeSelectEditVotersContainerListVoters = () => createSelector(
  (state) => state.getIn(['editVotersContainer', 'listVoters']),
  (state) => state && state.toJS(),
);

export const makeSelectEditVotersContainerBallot = () => createSelector(
  (state) => state.getIn(['editVotersContainer', 'ballot']),
  (state) => state && state.toJS(),
);
