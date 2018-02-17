import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import {
  Reboot,
  createMuiTheme,
  MuiThemeProvider,
} from 'material-ui';
import 'typeface-roboto/index.css';

import GlobalContainer from 'containers/GlobalContainer';
import ErrorBoundary from 'containers/ErrorBoundary';
import LanguageProvider from 'containers/LanguageProvider';

import configureStore from 'utils/configureStore';

// Import i18n messages
import { translationMessages } from 'utils/i18n';

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const theme = createMuiTheme({
});

const render = (messages) => {
  ReactDOM.render(
    <Provider store={store}>
      <ErrorBoundary>
        <ConnectedRouter history={history}>
          <ErrorBoundary>
            <LanguageProvider messages={messages}>
              <div>
                <Reboot />
                <MuiThemeProvider theme={theme}>
                  <GlobalContainer />
                </MuiThemeProvider>
              </div>
            </LanguageProvider>
          </ErrorBoundary>
        </ConnectedRouter>
      </ErrorBoundary>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['utils/i18n', 'containers/GlobalContainer'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

render(translationMessages);
