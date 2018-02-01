import { fromJS } from 'immutable';

import * as editVotersContainerSelectors from '../selectors';

describe('Voters', () => {
  const selector = editVotersContainerSelectors.Voters();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select voters', () => {
    const voters = [{ key: 'value' }];
    const state = fromJS({
      voters,
    });
    const mockedState = fromJS({
      editVotersContainer: state,
    });
    expect(selector(mockedState)).toEqual(voters);
  });
});

describe('Ballot', () => {
  const selector = editVotersContainerSelectors.Ballot();

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
      editVotersContainer: state,
    });
    expect(selector(mockedState)).toEqual(ballot);
  });
});

describe('Error', () => {
  const selector = editVotersContainerSelectors.Error();

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
      editVotersContainer: state,
    });
    expect(selector(mockedState)).toEqual(error);
  });
});
