import { fromJS } from 'immutable';

import {
  makeSelectViewBallotContainerBallot,
} from '../selectors';

describe('makeSelectViewBallotContainerBallot', () => {
  const selectViewBallotContainerBallot = makeSelectViewBallotContainerBallot();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selectViewBallotContainerBallot(mockedState)).not.toEqual(expect.anything());
  });

  it('should select ballot', () => {
    const ballot = { key: 'value' };
    const state = fromJS({
      ballot,
    });
    const mockedState = fromJS({
      viewBallotContainer: state,
    });
    expect(selectViewBallotContainerBallot(mockedState)).toEqual(ballot);
  });
});
