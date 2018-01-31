import { fromJS } from 'immutable';

import editVotersContainerReducer from '../reducer';

import * as editVotersContainerActions from '../actions';

describe('editVotersContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      voters: null,
      error: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(editVotersContainerReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions

  // Sagas
  it('should handle createVoter request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: '1', name: 'n' };
    const expectedResult = state.set('isLoading', true);

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.createVoterRequest(param))).toEqual(expectedResult);
  });

  it('should handle createVoter success', () => {
    const originalState = state.set('isLoading', true)
      .set('voters', fromJS([]));
    const result = { createVoter: { k: 'v' } };
    const expectedResult = state.set('isLoading', false)
      .set('voters', fromJS([{ k: 'v' }]));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.createVoterSuccess(result))).toEqual(expectedResult);
  });

  it('should handle createVoter failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.createVoterFailure(error))).toEqual(expectedResult);
  });

  it('should handle deleteVoter request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: '1', iCode: 'i' };
    const expectedResult = state.set('isLoading', true);

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.deleteVoterRequest(param))).toEqual(expectedResult);
  });

  it('should handle deleteVoter success', () => {
    const originalState = state.set('isLoading', true)
      .set('voters', fromJS([{ iCode: '1' }, { iCode: '2' }]));
    const param = { iCode: '1' };
    const result = { };
    const expectedResult = state.set('isLoading', false)
      .set('voters', fromJS([{ iCode: '2' }]));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.deleteVoterSuccess(result, param))).toEqual(expectedResult);
  });

  it('should handle deleteVoter failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.deleteVoterFailure(error))).toEqual(expectedResult);
  });

  it('should handle voters request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: '1' };
    const expectedResult = state.set('isLoading', true);

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.votersRequest(param))).toEqual(expectedResult);
  });

  it('should handle voters success', () => {
    const originalState = state.set('isLoading', true);
    const ballot = { name: 'nm', status: 'st' };
    const voters = [{ k: 'v' }];
    const result = { ballot: { ...ballot, voters } };
    const expectedResult = state.set('isLoading', false)
      .set('ballot', fromJS(ballot))
      .set('voters', fromJS(voters));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.votersSuccess(result))).toEqual(expectedResult);
  });

  it('should handle voters failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(editVotersContainerReducer(originalState, editVotersContainerActions.votersFailure(error))).toEqual(expectedResult);
  });
});
