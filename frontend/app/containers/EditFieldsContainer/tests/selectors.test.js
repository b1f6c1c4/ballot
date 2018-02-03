import { fromJS } from 'immutable';

import * as editFieldsContainerSelectors from '../selectors';

describe('Ballot', () => {
  const selector = editFieldsContainerSelectors.Ballot();

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
      editFieldsContainer: state,
    });
    expect(selector(mockedState)).toEqual(ballot);
  });
});

describe('Fields', () => {
  const selector = editFieldsContainerSelectors.Fields();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select fields', () => {
    const fields = { key: 'value' };
    const state = fromJS({
      fields,
    });
    const mockedState = fromJS({
      editFieldsContainer: state,
    });
    expect(selector(mockedState)).toEqual(fields);
  });
});

describe('Error', () => {
  const selector = editFieldsContainerSelectors.Error();

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
      editFieldsContainer: state,
    });
    expect(selector(mockedState)).toEqual(error);
  });
});
