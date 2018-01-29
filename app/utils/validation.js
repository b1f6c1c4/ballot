import messages from 'messages';

export const required = () => (value) => {
  if (value) return undefined;
  return messages.required;
};

export const minChar = (m) => (value) => {
  if (value.length >= m) return undefined;
  return [messages.minChar, { m }];
};

export const alphanumericDash = () => (value) => {
  if (/^[-a-zA-Z0-9]*$/.test(value)) return undefined;
  return messages.alphanumericDash;
};

export default (intl, ...os) => os.map((o) => (v) => {
  const res = o(v);
  if (!res) return undefined;
  if (!Array.isArray(res)) return intl.formatMessage(res);
  return intl.formatMessage(...res);
});