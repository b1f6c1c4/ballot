import { fromJS } from 'immutable';

import * as snackbarContainerSelectors from '../selectors';

describe('Message', () => {
  const selector = snackbarContainerSelectors.Message();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select message', () => {
    const message = { key: 'value' };
    const state = fromJS({
      message,
    });
    const mockedState = fromJS({
      snackbarContainer: state,
    });
    expect(selector(mockedState)).toEqual(message);
  });
});
