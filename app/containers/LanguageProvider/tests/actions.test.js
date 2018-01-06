import * as LANGUAGE_PROVIDER from '../constants';

import * as languageProviderActions from '../actions';

describe('LanguageProvider actions', () => {
  // Actions
  describe('changeLocale action', () => {
    it('has a type of CHANGE_LOCALE_ACTION', () => {
      expect(languageProviderActions.changeLocale().type).toEqual(LANGUAGE_PROVIDER.CHANGE_LOCALE_ACTION);
    });

    it('should forward locale', () => {
      expect(languageProviderActions.changeLocale('de').locale).toEqual('de');
    });
  });
});
