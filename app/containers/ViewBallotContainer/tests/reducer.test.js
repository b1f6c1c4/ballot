import { fromJS } from 'immutable';
import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as editVotersContainerActions from 'containers/EditVotersContainer/actions';
import * as editFieldsContainerActions from 'containers/EditFieldsContainer/actions';

import viewBallotContainerReducer from '../reducer';

import * as viewBallotContainerActions from '../actions';

describe('viewBallotContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      ballot: null,
      error: null,
      count: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(viewBallotContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle valid subscription status change action', () => {
    const originalState = state.set('ballot', fromJS({
      bId: 'b',
      status: 's',
      evil: true,
    }));
    const param = { bId: 'b', status: 'x' };
    const expectedResult = state.set('ballot', fromJS({
      bId: 'b',
      status: 'x',
      evil: true,
    }));

    expect(viewBallotContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle invalid subscription status change action', () => {
    const originalState = state.set('ballot', fromJS({
      bId: 'b',
      status: 's',
      evil: true,
    }));
    const param = { bId: 'x', status: 'x' };
    const expectedResult = state.set('ballot', fromJS({
      bId: 'b',
      status: 's',
      evil: true,
    }));

    expect(viewBallotContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle voterRgRequest action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.voterRgRequest({ bId: 'b' }))).toEq(expectedResult);
  });

  it('should handle voterRgStop action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.voterRgStop())).toEq(expectedResult);
  });

  it('should handle voterRegistered action not match', () => {
    const originalState = state.set('ballot', fromJS({
      bId: 'b',
      voters: [
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ],
    }));
    const param = { bId: 'b3', iCode: '1' };
    const expectedResult = state.set('ballot', fromJS({
      bId: 'b',
      voters: [
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ],
    }));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.voterRegistered(param))).toEq(expectedResult);
  });

  it('should handle voterRegistered action not found', () => {
    const originalState = state.set('ballot', fromJS({
      bId: 'b',
      voters: [
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ],
    }));
    const param = { bId: 'b', iCode: '3' };
    const expectedResult = state.set('ballot', fromJS({
      bId: 'b',
      voters: [
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ],
    }));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.voterRegistered(param))).toEq(expectedResult);
  });

  it('should handle voterRegistered action good', () => {
    const originalState = state.set('ballot', fromJS({
      bId: 'b',
      voters: [
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ],
    }));
    const param = { bId: 'b', iCode: '1' };
    const expectedResult = state.set('ballot', fromJS({
      bId: 'b',
      voters: [
        { iCode: '1', name: 'n1', publicKey: true },
        { iCode: '2', name: 'n2', publicKey: null },
      ],
    }));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.voterRegistered(param))).toEq(expectedResult);
  });

  // Sagas
  it('should handle ballot request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: '1' };
    const expectedResult = state.set('isLoading', true);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotRequest(param))).toEq(expectedResult);
  });

  it('should handle ballot success', () => {
    const originalState = state.set('isLoading', true);
    const result = { ballot: 'aa', countTickets: 213 };
    const expectedResult = state.set('isLoading', false)
      .set('ballot', 'aa')
      .set('count', 213);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotSuccess(result))).toEq(expectedResult);
  });

  it('should handle ballot failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotFailure(error))).toEq(expectedResult);
  });

  it('should handle finalize request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.finalizeRequest(param))).toEq(expectedResult);
  });

  it('should handle finalize success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.finalizeSuccess(result))).toEq(expectedResult);
  });

  it('should handle finalize failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.finalizeFailure(error))).toEq(expectedResult);
  });

  it('should handle export request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', false);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.exportRequest(param))).toEq(expectedResult);
  });

  it('should handle export success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', true);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.exportSuccess(result))).toEq(expectedResult);
  });

  it('should handle export failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', true)
      .set('error', fromJS(error));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.exportFailure(error))).toEq(expectedResult);
  });

  it('should handle voters create voter success', () => {
    const originalState = state.set('ballot', 'xx');
    const result = { };
    const expectedResult = state;

    expect(viewBallotContainerReducer(originalState, editVotersContainerActions.createVoterSuccess(result))).toEq(expectedResult);
  });

  it('should handle voters delete voter success', () => {
    const originalState = state.set('ballot', 'xx');
    const result = { };
    const expectedResult = state;

    expect(viewBallotContainerReducer(originalState, editVotersContainerActions.deleteVoterSuccess(result))).toEq(expectedResult);
  });

  it('should handle fields save success', () => {
    const originalState = state.set('ballot', 'xx');
    const result = { };
    const expectedResult = state;

    expect(viewBallotContainerReducer(originalState, editFieldsContainerActions.saveSuccess(result))).toEq(expectedResult);
  });
});
