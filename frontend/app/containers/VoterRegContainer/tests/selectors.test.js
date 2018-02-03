import { fromJS } from 'immutable';

import * as voterRegContainerSelectors from '../selectors';

describe('Ballot', () => {
  const selector = voterRegContainerSelectors.Ballot();

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
      voterRegContainer: state,
    });
    expect(selector(mockedState)).toEqual(ballot);
  });
});

describe('Error', () => {
  const selector = voterRegContainerSelectors.Error();

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
      voterRegContainer: state,
    });
    expect(selector(mockedState)).toEqual(error);
  });
});
