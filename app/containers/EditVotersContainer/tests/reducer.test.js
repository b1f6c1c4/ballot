import { fromJS } from 'immutable';

import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as editVotersContainerActions from '../actions';
import editVotersContainerReducer from '../reducer';

describe('editVotersContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      isCreateLoading: false,
      ballot: null,
      voters: null,
      error: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(editVotersContainerReducer(undefined, {})).toEq(expectedResult);
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

    expect(editVotersContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
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

    expect(editVotersContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle voterRegistered action null', () => {
    const originalState = state.set('ballot', fromJS({
      bId: 'b',
    }));
    const param = { iCode: '1' };
    const expectedResult = state.set('ballot', fromJS({
      bId: 'b',
    }));

    expect(editVotersContainerReducer(originalState, subscriptionContainerActions.voterRegistered('b', param))).toEq(expectedResult);
  });

  it('should handle voterRegistered action not match', () => {
    const originalState = state.set('ballot', fromJS({ bId: 'b' }))
      .set('voters', fromJS([
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ]));
    const param = { iCode: '1' };
    const expectedResult = state.set('ballot', fromJS({ bId: 'b' }))
      .set('voters', fromJS([
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ]));

    expect(editVotersContainerReducer(originalState, subscriptionContainerActions.voterRegistered('b3', param))).toEq(expectedResult);
  });

  it('should handle voterRegistered action not found', () => {
    const originalState = state.set('ballot', fromJS({ bId: 'b' }))
      .set('voters', fromJS([
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ]));
    const param = { iCode: '3' };
    const expectedResult = state.set('ballot', fromJS({ bId: 'b' }))
      .set('voters', fromJS([
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ]));

    expect(editVotersContainerReducer(originalState, subscriptionContainerActions.voterRegistered('b', param))).toEq(expectedResult);
  });

  it('should handle voterRegistered action good', () => {
    const originalState = state.set('ballot', fromJS({ bId: 'b' }))
      .set('voters', fromJS([
        { iCode: '1', name: 'n1', publicKey: null },
        { iCode: '2', name: 'n2', publicKey: null },
      ]));
    const param = { iCode: '1', comment: 'x' };
    const expectedResult = state.set('ballot', fromJS({ bId: 'b' }))
      .set('voters', fromJS([
        { iCode: '1', name: 'n1', comment: 'x' },
        { iCode: '2', name: 'n2', publicKey: null },
      ]));

    expect(editVotersContainerReducer(originalState, subscriptionContainerActions.voterRegistered('b', param))).toEq(expectedResult);
  });

  it('should handle voterRgRequest action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.voterRgRequest())).toEq(expectedResult);
  });

  // Sagas
  it('should handle createVoter request', () => {
    const originalState = state.set('isCreateLoading', false).set('error', 'e');
    const param = { bId: '1', name: 'n' };
    const expectedResult = state.set('isCreateLoading', true);

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.createVoterRequest(param))).toEq(expectedResult);
  });

  it('should handle createVoter success', () => {
    const originalState = state.set('isCreateLoading', true)
      .set('voters', fromJS([]));
    const result = { createVoter: { k: 'v' } };
    const expectedResult = state.set('isCreateLoading', false)
      .set('voters', fromJS([{ k: 'v' }]));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.createVoterSuccess(result))).toEq(expectedResult);
  });

  it('should handle createVoter failure', () => {
    const originalState = state.set('isCreateLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isCreateLoading', false)
      .set('error', fromJS(error));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.createVoterFailure(error))).toEq(expectedResult);
  });

  it('should handle deleteVoter request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: '1', iCode: 'i' };
    const expectedResult = state.set('isLoading', true);

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.deleteVoterRequest(param))).toEq(expectedResult);
  });

  it('should handle deleteVoter success', () => {
    const originalState = state.set('isLoading', true)
      .set('voters', fromJS([{ iCode: '1' }, { iCode: '2' }]));
    const param = { iCode: '1' };
    const result = { };
    const expectedResult = state.set('isLoading', false)
      .set('voters', fromJS([{ iCode: '2' }]));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.deleteVoterSuccess(result, param))).toEq(expectedResult);
  });

  it('should handle deleteVoter failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.deleteVoterFailure(error))).toEq(expectedResult);
  });

  it('should handle voters request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: '1' };
    const expectedResult = state.set('isLoading', true);

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.votersRequest(param))).toEq(expectedResult);
  });

  it('should handle voters success', () => {
    const originalState = state.set('isLoading', true);
    const ballot = { bId: 'b', name: 'nm', status: 'st' };
    const voters = [{ k: 'v' }];
    const result = { ballot: { ...ballot, voters } };
    const expectedResult = state.set('isLoading', false)
      .set('ballot', fromJS(ballot))
      .set('voters', fromJS(voters));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.votersSuccess(result))).toEq(expectedResult);
  });

  it('should handle voters failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.votersFailure(error))).toEq(expectedResult);
  });
});
