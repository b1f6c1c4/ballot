import { fromJS } from 'immutable';

import {
  makeSelectEditVotersContainerListVoters,
  makeSelectEditVotersContainerError,
  makeSelectEditVotersContainerBallot,
} from '../selectors';

describe('makeSelectEditVotersContainerListVoters', () => {
  const selectEditVotersContainerListVoters = makeSelectEditVotersContainerListVoters();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selectEditVotersContainerListVoters(mockedState)).not.toEqual(expect.anything());
  });

  it('should select listVoters', () => {
    const listVoters = [{ key: 'value' }];
    const state = fromJS({
      listVoters,
    });
    const mockedState = fromJS({
      editVotersContainer: state,
    });
    expect(selectEditVotersContainerListVoters(mockedState)).toEqual(listVoters);
  });
});

describe('makeSelectEditVotersContainerBallot', () => {
  const selectEditVotersContainerBallot = makeSelectEditVotersContainerBallot();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selectEditVotersContainerBallot(mockedState)).not.toEqual(expect.anything());
  });

  it('should select ballot', () => {
    const ballot = { key: 'value' };
    const state = fromJS({
      ballot,
    });
    const mockedState = fromJS({
      editVotersContainer: state,
    });
    expect(selectEditVotersContainerBallot(mockedState)).toEqual(ballot);
  });
});

describe('makeSelectEditVotersContainerError', () => {
  const selectEditVotersContainerError = makeSelectEditVotersContainerError();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selectEditVotersContainerError(mockedState)).not.toEqual(expect.anything());
  });

  it('should select error', () => {
    const error = { key: 'value' };
    const state = fromJS({
      error,
    });
    const mockedState = fromJS({
      editVotersContainer: state,
    });
    expect(selectEditVotersContainerError(mockedState)).toEqual(error);
  });
});
