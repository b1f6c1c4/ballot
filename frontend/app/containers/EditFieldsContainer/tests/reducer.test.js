import { fromJS } from 'immutable';
import * as globalContainerActions from 'containers/GlobalContainer/actions';

import editFieldsContainerReducer, {
  normalizeFields,
} from '../reducer';

import * as editFieldsContainerActions from '../actions';

jest.mock('shortid', () => ({
  generate: () => 'id',
}));

describe('normalizeFields', () => {
  it('shuold parse string field', () => {
    const result = normalizeFields([
      { __typename: 'StringField', default: 'def' },
    ]);
    expect(result).toEq([
      { type: 'StringField', key: 'id', stringDefault: 'def' },
    ]);
  });

  it('shuold parse enum field', () => {
    const result = normalizeFields([
      { __typename: 'EnumField', items: ['def'] },
    ]);
    expect(result).toEq([
      { type: 'EnumField', key: 'id', enumItems: ['def'] },
    ]);
  });

  it('should throw unsupported', () => {
    expect(() => normalizeFields([{ __typename: 'unk' }])).toThrow();
  });
});

describe('editFieldsContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      isPristine: true,
      isOpen: false,
      isCreate: false,
      ballot: null,
      fields: null,
      error: null,
      currentId: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(editFieldsContainerReducer(undefined, {})).toEq(expectedResult);
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

    expect(editFieldsContainerReducer(originalState, globalContainerActions.statusChange(param))).toEq(expectedResult);
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

    expect(editFieldsContainerReducer(originalState, globalContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle remove action', () => {
    const originalState = state
      .set('fields', fromJS([
        { key: 'f1' },
        { key: 'f2' },
      ]));
    const param = { index: 0 };
    const expectedResult = state.set('isPristine', false)
      .set('fields', fromJS([
        { key: 'f2' },
      ]));

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.remove(param))).toEq(expectedResult);
  });

  it('should handle reorder action', () => {
    const originalState = state
      .set('fields', fromJS([
        { key: 'f1' },
        { key: 'f2' },
        { key: 'f3' },
      ]));
    const param = { from: 0, to: 2 };
    const expectedResult = state.set('isPristine', false)
      .set('fields', fromJS([
        { key: 'f2' },
        { key: 'f3' },
        { key: 'f1' },
      ]));

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.reorder(param))).toEq(expectedResult);
  });

  it('should handle startEdit action', () => {
    const originalState = state;
    const param = { index: 123 };
    const expectedResult = state
      .set('isOpen', true)
      .set('isCreate', false)
      .set('currentId', 123);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.startEdit(param))).toEq(expectedResult);
  });

  it('should handle startCreate action', () => {
    const originalState = state;
    const expectedResult = state
      .set('isOpen', true)
      .set('isCreate', true);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.startCreate())).toEq(expectedResult);
  });

  it('should handle cancelDialog action', () => {
    const originalState = state.set('isOpen', true);
    const expectedResult = state;

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.cancelDialog())).toEq(expectedResult);
  });

  it('should handle submitDialog action for create', () => {
    const originalState = state
      .set('isOpen', true)
      .set('isCreate', true)
      .set('fields', fromJS([
        { key: 'f1' },
      ]));
    const param = { field: { prompt: 'p' } };
    const expectedResult = state
      .set('isOpen', false)
      .set('isPristine', false)
      .set('fields', fromJS([
        { key: 'f1' },
        { key: 'id', prompt: 'p' },
      ]));

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.submitDialog(param))).toEq(expectedResult);
  });

  it('should handle submitDialog action for edit', () => {
    const originalState = state
      .set('isOpen', true)
      .set('isCreate', false)
      .set('currentId', 0)
      .set('fields', fromJS([
        { key: 'f1' },
        { key: 'f2' },
      ]));
    const param = { field: { prompt: 'p' } };
    const expectedResult = state
      .set('isOpen', false)
      .set('isPristine', false)
      .set('fields', fromJS([
        { key: 'f1', prompt: 'p' },
        { key: 'f2' },
      ]));

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.submitDialog(param))).toEq(expectedResult);
  });

  // Sagas
  it('should handle save request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.saveRequest(param))).toEq(expectedResult);
  });

  it('should handle save success', () => {
    const originalState = state.set('isLoading', true);
    const result = {
      replaceFields: [
        { __typename: 'StringField', prompt: 'p1' },
        { __typename: 'EnumField', prompt: 'p2', items: ['v'] },
      ],
    };
    const expectedResult = state.set('isLoading', false)
      .set('fields', fromJS([
        {
          type: 'StringField',
          key: 'id',
          prompt: 'p1',
        },
        {
          type: 'EnumField',
          key: 'id',
          prompt: 'p2',
          enumItems: ['v'],
        },
      ]));

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.saveSuccess(result))).toEq(expectedResult);
  });

  it('should handle save success error', () => {
    const originalState = state.set('isLoading', true);
    const result = {
      replaceFields: [
        { __typename: 'unknown' },
      ],
    };
    const expectedResult = state.set('isLoading', false)
      .set('error', { codes: ['tpns'] });

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.saveSuccess(result))).toEq(expectedResult);
  });

  it('should handle save failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.saveFailure(error))).toEq(expectedResult);
  });

  it('should handle refresh request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.refreshRequest(param))).toEq(expectedResult);
  });

  it('should handle refresh success', () => {
    const originalState = state.set('isLoading', true);
    const ballot = { bId: 'b', name: 'n', status: 's' };
    const result = {
      ballot: {
        ...ballot,
        fields: [
          { __typename: 'StringField', prompt: 'p1' },
          { __typename: 'EnumField', prompt: 'p2', items: ['v'] },
        ],
      },
    };
    const expectedResult = state.set('isLoading', false)
      .set('ballot', fromJS(ballot))
      .set('fields', fromJS([
        {
          type: 'StringField',
          key: 'id',
          prompt: 'p1',
        },
        {
          type: 'EnumField',
          key: 'id',
          prompt: 'p2',
          enumItems: ['v'],
        },
      ]));

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.refreshSuccess(result))).toEq(expectedResult);
  });

  it('should handle refresh success error', () => {
    const originalState = state.set('isLoading', true);
    const result = {
      ballot: {
        fields: [
          { __typename: 'unknown' },
        ],
      },
    };
    const expectedResult = state.set('isLoading', false)
      .set('error', { codes: ['tpns'] });

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.refreshSuccess(result))).toEq(expectedResult);
  });

  it('should handle refresh failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.refreshFailure(error))).toEq(expectedResult);
  });
});
