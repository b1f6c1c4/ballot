import { fromJS } from 'immutable';

import {
  makeSelectEditVotersContainerVoters,
  makeSelectEditVotersContainerError,
  makeSelectEditVotersContainerBallot,
} from '../selectors';

describe('makeSelectEditVotersContainerVoters', () => {
  const selectEditVotersContainerVoters = makeSelectEditVotersContainerVoters();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selectEditVotersContainerVoters(mockedState)).not.toEqual(expect.anything());
  });

  it('should select voters', () => {
    const voters = [{ key: 'value' }];
    const state = fromJS({
      voters,
    });
    const mockedState = fromJS({
      editVotersContainer: state,
    });
    expect(selectEditVotersContainerVoters(mockedState)).toEqual(voters);
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
