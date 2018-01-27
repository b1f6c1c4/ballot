/**
 * Container selector generator
 */

module.exports = {
  description: 'Add a selector to a container',
  prompts: [{
    type: 'input',
    name: 'name',
    default: 'FormContainer',
    message: 'Name of the container?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return true;
      }

      return 'The name is required';
    },
  }, {
    type: 'input',
    name: 'mselectorName',
    default: 'filtered data',
    message: 'Name of the selector?',
  }, {
    type: 'confirm',
    name: 'confirm',
    default: true,
    message: 'Are you sure?',
  }],
  actions: (data) => {
    if (!data.confirm) {
      return [];
    }

    const actions = [];

    // selectors.js
    actions.push({
      type: 'complexModify',
      method: 'sectionEnd',
      indent: 0,
      section: /.*/g,
      pattern: /(?!)/g,
      path: '../../app/containers/{{ properCase name }}/selectors.js',
      templateFile: './container/selector/selectors.js.hbs',
      abortOnFail: true,
    });

    // selectors.test.js
    actions.push({
      type: 'complexModify',
      method: 'lastOccurance',
      pattern: /^ {2}makeSelect[a-zA-Z]+,$/g,
      path: '../../app/containers/{{ properCase name }}/tests/selectors.test.js',
      template: '  makeSelect{{ properCase name }}{{ properCase mselectorName }},',
      abortOnFail: true,
    });
    actions.push({
      type: 'complexModify',
      method: 'sectionEnd',
      indent: 0,
      section: /.*/g,
      pattern: /(?!)/g,
      path: '../../app/containers/{{ properCase name }}/tests/selectors.test.js',
      templateFile: './container/selector/selectors.test.js.hbs',
      abortOnFail: true,
    });

    // index.js
    actions.push({
      type: 'complexModify',
      method: 'lastOccurance',
      pattern: /^ {2}makeSelect[a-zA-Z]+,$/g,
      path: '../../app/containers/{{ properCase name }}/index.js',
      template: '  makeSelect{{ properCase name }}{{ properCase mselectorName }},',
      abortOnFail: true,
    });
    actions.push({
      type: 'complexModify',
      method: 'lastOccurance',
      pattern: /^ {2}[a-np-z][a-mn-zA-Z]?[a-zA-Z]*: PropTypes/g,
      path: '../../app/containers/{{ properCase name }}/index.js',
      template: '  {{ camelCase mselectorName }}: PropTypes.string.isRequired,',
      abortOnFail: true,
    });
    actions.push({
      type: 'complexModify',
      method: 'lastOccurance',
      pattern: /^ {2}[a-zA-Z]+: makeSelect[a-zA-Z]+\(\),$/g,
      path: '../../app/containers/{{ properCase name }}/index.js',
      template: '  {{ camelCase mselectorName }}: makeSelect{{ properCase name }}{{ properCase mselectorName }}(),',
      abortOnFail: true,
    });

    // index.test.js
    actions.push({
      type: 'complexModify',
      method: 'sectionEnd',
      indent: 8,
      section: /^ {8}\/\/ Selectors/g,
      pattern: /^ {8}\/\/ [A-Z][a-zA-Z]*$/g,
      path: '../../app/containers/{{ properCase name }}/tests/index.test.js',
      template: '        {{ camelCase mselectorName }}="value"',
      abortOnFail: true,
    });

    return actions;
  },
};
