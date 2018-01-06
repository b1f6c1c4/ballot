/**
 * Container saga generator
 */

module.exports = {
  description: 'Add a saga to a container',
  prompts: [{
    type: 'input',
    name: 'name',
    default: 'Form',
    message: 'Name of the container?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return true;
      }

      return 'The name is required';
    },
  }, {
    type: 'input',
    name: 'sagaName',
    default: 'ext',
    message: 'Name of the saga?',
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

    // constants.js
    actions.push({
      type: 'complexModify',
      method: 'lastOccurance',
      pattern: /[A-Z_]+_FAILURE';$/g,
      path: '../../app/containers/{{ properCase name }}/constants.js',
      template: `export const {{ constantCase sagaName }}_REQUEST = '{{ properCase name }}/{{ constantCase sagaName }}_REQUEST';
export const {{ constantCase sagaName }}_SUCCESS = '{{ properCase name }}/{{ constantCase sagaName }}_SUCCESS';
export const {{ constantCase sagaName }}_FAILURE = '{{ properCase name }}/{{ constantCase sagaName }}_FAILURE';`,
      abortOnFail: true,
    });

    // actions.js
    actions.push({
      type: 'complexModify',
      method: 'sectionEnd',
      indent: 0,
      section: /^\/\/ Sagas/g,
      pattern: /^\/\/ [A-Z][a-zA-Z]*$/g,
      path: '../../app/containers/{{ properCase name }}/actions.js',
      templateFile: './container/saga/actions.js.hbs',
      abortOnFail: true,
    });

    // reducer.js
    actions.push({
      type: 'complexModify',
      method: 'sectionEnd',
      indent: 4,
      postpadding: false,
      section: /^ {4}\/\/ Sagas/g,
      pattern: /^ {4}\/\/ [A-Z][a-zA-Z]*$/g,
      path: '../../app/containers/{{ properCase name }}/reducer.js',
      templateFile: './container/saga/reducer.js.hbs',
      abortOnFail: true,
    });

    // reducer.test.js
    actions.push({
      type: 'complexModify',
      method: 'sectionEnd',
      indent: 2,
      section: /^ {2}\/\/ Sagas/g,
      pattern: /^ {2}\/\/ [A-Z][a-zA-Z]*$/g,
      path: '../../app/containers/{{ properCase name }}/tests/reducer.test.js',
      templateFile: './container/saga/reducer.test.js.hbs',
      abortOnFail: true,
    });

    // sagas.js
    actions.push({
      type: 'complexModify',
      method: 'sectionEnd',
      indent: 0,
      section: /^\/\/ Sagas/g,
      pattern: /^\/\/ [A-Z][a-zA-Z]*$/g,
      path: '../../app/containers/{{ properCase name }}/sagas.js',
      templateFile: './container/saga/sagas.js.hbs',
      abortOnFail: true,
    });
    actions.push({
      type: 'complexModify',
      method: 'lastOccurance',
      pattern: /^ {2}yield take.*REQUEST.*Request\);$/g,
      path: '../../app/containers/{{ properCase name }}/sagas.js',
      template: `  /* istanbul ignore next */
  yield takeEvery({{ constantCase name }}.{{ constantCase sagaName }}_REQUEST, handle{{ properCase sagaName }}Request);`,
      abortOnFail: true,
    });

    // sagas.test.js
    actions.push({
      type: 'complexModify',
      method: 'lastOccurance',
      pattern: /^ {2}handle[a-zA-Z]+Request,$/g,
      path: '../../app/containers/{{ properCase name }}/tests/sagas.test.js',
      template: '  handle{{ properCase sagaName }}Request,',
      abortOnFail: true,
    });
    actions.push({
      type: 'complexModify',
      method: 'sectionEnd',
      indent: 0,
      section: /^\/\/ Sagas/g,
      pattern: /^\/\/ [A-Z][a-zA-Z]*$/g,
      path: '../../app/containers/{{ properCase name }}/tests/sagas.test.js',
      templateFile: './container/saga/sagas.test.js.hbs',
      abortOnFail: true,
    });

    return actions;
  },
};
