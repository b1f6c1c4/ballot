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

  it('should handle range', () => {
    const state = fromJS({
      stats: [['a'], ['b']],
      fieldIndex: 10,
    });
    const mockedState = fromJS({
      viewStatContainer: state,
    });
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select stat', () => {
    const state = fromJS({
      stats: [['a'], ['b']],
      fieldIndex: 1,
    });
    const mockedState = fromJS({
      viewStatContainer: state,
    });
    expect(selector(mockedState)).toEqual(['b']);
  });
});

describe('Error', () => {
  const selector = viewStatContainerSelectors.Error();

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
      viewStatContainer: state,
    });
    expect(selector(mockedState)).toEqual(error);
  });
});
