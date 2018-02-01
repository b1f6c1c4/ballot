import { fromJS } from 'immutable';

import * as globalContainerSelectors from '../selectors';

describe('ListBallots', () => {
  const selector = globalContainerSelectors.ListBallots();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select listBallots', () => {
    const listBallots = ['value'];
    const state = fromJS({
      listBallots,
    });
    const mockedState = fromJS({
      globalContainer: state,
    });
    expect(selector(mockedState)).toEqual(listBallots);
  });
});
