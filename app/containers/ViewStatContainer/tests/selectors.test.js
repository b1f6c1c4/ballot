import { fromJS } from 'immutable';

import * as viewStatContainerSelectors from '../selectors';

describe('Ballot', () => {
  const selector = viewStatContainerSelectors.Ballot();

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
      viewStatContainer: state,
    });
    expect(selector(mockedState)).toEqual(ballot);
  });
});

describe('Stat', () => {
  const selector = viewStatContainerSelectors.Stat();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select stat', () => {
    const stat = { key: 'value' };
    const state = fromJS({
      stat,
    });
    const mockedState = fromJS({
      viewStatContainer: state,
    });
    expect(selector(mockedState)).toEqual(stat);
  });
});
