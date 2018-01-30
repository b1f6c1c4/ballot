import { fromJS } from 'immutable';

import {
  selectGlobalContainer,
  makeSelectGlobalContainerListBallots,
} from '../selectors';

describe('selectGlobalContainer', () => {
  it('should select the globalContainer state', () => {
    const state = 'value';
    const mockedState = fromJS({
      globalContainer: state,
    });
    expect(selectGlobalContainer(mockedState)).toEqual(state);
  });
});

describe('makeSelectGlobalContainerListBallots', () => {
  const selectGlobalContainerListBallots = makeSelectGlobalContainerListBallots();

  it('should select listBallots', () => {
    const listBallots = 'value';
    const state = fromJS({
      listBallots,
    });
    const mockedState = fromJS({
      globalContainer: state,
    });
    expect(selectGlobalContainerListBallots(mockedState)).toEqual(listBallots);
  });
});
