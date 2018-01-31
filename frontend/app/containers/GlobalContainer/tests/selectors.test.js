import { fromJS } from 'immutable';

import {
  makeSelectGlobalContainerListBallots,
} from '../selectors';

describe('makeSelectGlobalContainerListBallots', () => {
  const selectGlobalContainerListBallots = makeSelectGlobalContainerListBallots();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selectGlobalContainerListBallots(mockedState)).not.toEqual(expect.anything());
  });

  it('should select listBallots', () => {
    const listBallots = ['value'];
    const state = fromJS({
      listBallots,
    });
    const mockedState = fromJS({
      globalContainer: state,
    });
    expect(selectGlobalContainerListBallots(mockedState)).toEqual(listBallots);
  });
});
