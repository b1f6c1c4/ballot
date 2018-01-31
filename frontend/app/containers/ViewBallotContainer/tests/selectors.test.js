import { fromJS } from 'immutable';

import {
  makeSelectViewBallotContainerBallot,
  makeSelectViewBallotContainerError,
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

describe('makeSelectViewBallotContainerError', () => {
  const selectViewBallotContainerError = makeSelectViewBallotContainerError();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selectViewBallotContainerError(mockedState)).not.toEqual(expect.anything());
  });

  it('should select error', () => {
    const error = { key: 'value' };
    const state = fromJS({
      error,
    });
    const mockedState = fromJS({
      viewBallotContainer: state,
    });
    expect(selectViewBallotContainerError(mockedState)).toEqual(error);
  });
});
