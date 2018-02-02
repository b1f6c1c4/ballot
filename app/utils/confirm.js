import messages from './messages';

export default (intl, func) => () => {
  if (func()) return undefined;
  const msg = messages.beforeLeave;
  // eslint-disable-next-line no-alert
  return intl.formatMessage(msg);
};
