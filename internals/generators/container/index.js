/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a container (smart) component',
  prompts: [{
    type: 'input',
    name: 'name',
    default: 'FormContainer',
    message: 'What should it be called?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'confirm',
    name: 'wantSelectors',
    default: true,
    message: 'Do you want selectors?',
  }, {
    type: 'input',
    name: 'selectorName',
    when: (ans) => ans.wantSelectors,
    default: 'data',
    message: 'Selector name?',
  }, {
    type: 'confirm',
    name: 'wantMSelectors',
    when: (ans) => ans.wantSelectors,
    default: true,
    message: 'Do you want memorized selectors?',
  }, {
    type: 'input',
    name: 'mselectorName',
    when: (ans) => ans.wantMSelectors,
    default: 'complex data',
    message: 'Memorized selector name?',
  }, {
    type: 'confirm',
    name: 'wantActionsAndReducer',
    when: (ans) => ans.wantSelectors,
    default: true,
    message: 'Do you want an actions/reducer tuple for this container?',
  }, {
    type: 'input',
    name: 'actionName',
    when: (ans) => ans.wantActionsAndReducer,
    default: 'change',
    message: 'Action name?',
  }, {
    type: 'confirm',
    name: 'wantSagas',
    when: (ans) => ans.wantActionsAndReducer,
    default: true,
    message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
  }, {
    type: 'input',
    name: 'sagaName',
    when: (ans) => ans.wantSagas,
    default: 'external',
    message: 'Saga name?',
  }, {
    type: 'confirm',
    name: 'wantLoadable',
    default: true,
    message: 'Do you want to load resources asynchronously?',
  }],
  actions: (data) => {
    const actions = [];

    // Generate index.js
    actions.push({
      type: 'add',
      path: '../../app/containers/{{properCase name}}/index.js',
      templateFile: './container/class.js.hbs',
      abortOnFail: true,
    });

    if (data.wantMSelectors) {
      // Generate selectors.js
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/selectors.js',
        templateFile: './container/selectors.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/tests/selectors.test.js',
        templateFile: './container/selectors.test.js.hbs',
        abortOnFail: true,
      });
    }

    if (data.wantActionsAndReducer) {
      // Generate constants.js
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/constants.js',
        templateFile: './container/constants.js.hbs',
        abortOnFail: true,
      });

      // Generate actions.js
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/actions.js',
        templateFile: './container/actions.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/tests/actions.test.js',
        templateFile: './container/actions.test.js.hbs',
        abortOnFail: true,
      });

      // Generate reducer.js
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/reducer.js',
        templateFile: './container/reducer.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/tests/reducer.test.js',
        templateFile: './container/reducer.test.js.hbs',
        abortOnFail: true,
      });

      if (data.wantSagas) {
        // Generate sagas.js
        actions.push({
          type: 'add',
          path: '../../app/containers/{{properCase name}}/sagas.js',
          templateFile: './container/sagas.js.hbs',
          abortOnFail: true,
        });
        actions.push({
          type: 'add',
          path: '../../app/containers/{{properCase name}}/tests/sagas.test.js',
          templateFile: './container/sagas.test.js.hbs',
          abortOnFail: true,
        });

        // Generate api.graphql
        actions.push({
          type: 'add',
          path: '../../app/containers/{{properCase name}}/api.graphql',
          templateFile: './container/api.graphql.hbs',
          abortOnFail: true,
        });
      }
    }

    if (data.wantLoadable) {
      // Generate loadable.js
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/Loadable.js',
        templateFile: './component/loadable.js.hbs',
        abortOnFail: true,
      });
    } else if (data.wantActionsAndReducer) {
      actions.push({
        type: 'modify',
        pattern: /(from\s'containers\/[a-zA-Z]+\/reducer';\n)(?!.*from\s'containers\/[a-zA-Z]+\/reducer';)/g,
        path: '../../app/reducers.js',
        templateFile: './container/reducers-import.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'modify',
        pattern: /([a-zA-Z]+Reducer,\n)(?!.*[a-zA-Z]+Reducer,)/g,
        path: '../../app/reducers.js',
        templateFile: './container/reducers-combine.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
