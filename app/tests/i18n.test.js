import { ROOT_LOCALE, formatTranslationMessages } from '../i18n';

jest.mock('../translations/en.json', () => (
  {
    message1: 'default message',
    message2: 'default message 2',
  }
));

const esTranslationMessages = {
  message1: 'mensaje predeterminado',
  message2: '',
};

describe('formatTranslationMessages', () => {
  it('should build only defaults when ROOT_LOCALE', () => {
    const result = formatTranslationMessages(ROOT_LOCALE, { a: 'a' });

    expect(result).toEqual({ a: 'a' });
  });


  it('should combine default locale and current locale when not ROOT_LOCALE', () => {
    const result = formatTranslationMessages('', esTranslationMessages);

    expect(result).toEqual({
      message1: 'mensaje predeterminado',
      message2: 'default message 2',
    });
  });
});
