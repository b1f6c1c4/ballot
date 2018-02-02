import { fromJS } from 'immutable';

import * as preVotingContainerSelectors from '../selectors';

describe('Ballot', () => {
  const selector = preVotingContainerSelectors.Ballot();

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
      preVotingContainer: state,
    });
    expect(selector(mockedState)).toEqual(ballot);
  });
});

describe('Error', () => {
  const selector = preVotingContainerSelectors.Error();

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
      preVotingContainer: state,
    });
    expect(selector(mockedState)).toEqual(error);
  });
});

describe('Ticket', () => {
  const selector = preVotingContainerSelectors.Ticket();

  it('should handle null', () => {
    const mockedState = fromJS({});
    expect(selector(mockedState)).not.toEqual(expect.anything());
  });

  it('should select ticket', () => {
    const ticket = { key: 'value' };
    const state = fromJS({
      ticket,
    });
    const mockedState = fromJS({
      preVotingContainer: state,
    });
    expect(selector(mockedState)).toEqual(ticket);
  });
});
