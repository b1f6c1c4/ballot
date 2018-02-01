import { fromJS } from 'immutable';

import * as viewBallotContainerSelectors from '../selectors';

describe('Ballot', () => {
  const selector = viewBallotContainerSelectors.Ballot();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select ballot', () => {
    const ballot = { key: 'value' };
    const state = fromJS({
      ballot,
    });
    const mockedState = fromJS({
      viewBallotContainer: state,
    });
    expect(selector(mockedState)).toEqual(ballot);
  });
});

describe('Error', () => {
  const selector = viewBallotContainerSelectors.Error();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select error', () => {
    const error = { key: 'value' };
    const state = fromJS({
      error,
    });
    const mockedState = fromJS({
      viewBallotContainer: state,
    });
    expect(selector(mockedState)).toEqual(error);
  });
});
