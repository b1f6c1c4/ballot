import { fromJS } from 'immutable';
import * as globalContainerActions from 'containers/GlobalContainer/actions';

import editVotersContainerReducer from '../reducer';

import * as editVotersContainerActions from '../actions';

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
  it('should handle valid global status change action', () => {
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

    expect(editVotersContainerReducer(originalState, globalContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle invalid global status change action', () => {
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

    expect(editVotersContainerReducer(originalState, globalContainerActions.statusChange(param))).toEq(expectedResult);
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