import makeConfirmSave from '../confirm';

jest.mock('utils/messages', () => ({
  beforeLeave: 'v',
}));

describe('makeConfirmSave', () => {
  it('should not prompt when pristine', () => {
    const intl = {
      formatMessage: () => expect(undefined).toBeDefined(),
    };
    expect(makeConfirmSave(intl, () => true)()).toBeUndefined();
  });

  it('should prompt when not pristine', () => {
    const intl = {
      formatMessage: (id) => {
        expect(id).toEqual('v');
        return 'val';
      },
    };
    expect(makeConfirmSave(intl, () => false)()).toEqual('val');
  });
});
