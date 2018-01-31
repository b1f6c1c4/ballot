import * as Permission from '../permission';

describe('status unknown', () => {
  const status = 'unknown';

  it('cannot edit fields', () => {
    expect(Permission.CanEditFields({ status })).toEqual(false);
  });
  it('cannot edit voters', () => {
    expect(Permission.CanEditVoters({ status })).toEqual(false);
  });
  it('cannot view stats', () => {
    expect(Permission.CanViewStats({ status })).toEqual(false);
  });
});

describe('status creating', () => {
  const status = 'creating';

  it('can edit fields', () => {
    expect(Permission.CanEditFields({ status })).toEqual(true);
  });
  it('cannot edit voters', () => {
    expect(Permission.CanEditVoters({ status })).toEqual(false);
  });
  it('cannot view stats', () => {
    expect(Permission.CanViewStats({ status })).toEqual(false);
  });
});

describe('status inviting', () => {
  const status = 'inviting';

  it('can edit fields', () => {
    expect(Permission.CanEditFields({ status })).toEqual(true);
  });
  it('can edit voters', () => {
    expect(Permission.CanEditVoters({ status })).toEqual(true);
  });
  it('cannot view stats', () => {
    expect(Permission.CanViewStats({ status })).toEqual(false);
  });
});

describe('status invited', () => {
  const status = 'invited';

  it('can edit fields', () => {
    expect(Permission.CanEditFields({ status })).toEqual(true);
  });
  it('cannot edit voters', () => {
    expect(Permission.CanEditVoters({ status })).toEqual(false);
  });
  it('cannot view stats', () => {
    expect(Permission.CanViewStats({ status })).toEqual(false);
  });
});

describe('status preVoting', () => {
  const status = 'preVoting';

  it('cannot edit fields', () => {
    expect(Permission.CanEditFields({ status })).toEqual(false);
  });
  it('cannot edit voters', () => {
    expect(Permission.CanEditVoters({ status })).toEqual(false);
  });
  it('cannot view stats', () => {
    expect(Permission.CanViewStats({ status })).toEqual(false);
  });
});

describe('status voting', () => {
  const status = 'voting';

  it('cannot edit fields', () => {
    expect(Permission.CanEditFields({ status })).toEqual(false);
  });
  it('cannot edit voters', () => {
    expect(Permission.CanEditVoters({ status })).toEqual(false);
  });
  it('can view stats', () => {
    expect(Permission.CanViewStats({ status })).toEqual(true);
  });
});

describe('status finished', () => {
  const status = 'finished';

  it('cannot edit fields', () => {
    expect(Permission.CanEditFields({ status })).toEqual(false);
  });
  it('cannot edit voters', () => {
    expect(Permission.CanEditVoters({ status })).toEqual(false);
  });
  it('can view stats', () => {
    expect(Permission.CanViewStats({ status })).toEqual(true);
  });
});
