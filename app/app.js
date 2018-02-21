import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import createHistory from 'history/createBrowserHistory';
import {
  Reboot,
  createMuiTheme,
  MuiThemeProvider,
} from 'material-ui';
import Teal from 'material-ui/colors/teal';
import Brown from 'material-ui/colors/brown';
import 'typeface-roboto/index.css';
import 'index/typeface-noto-sans.css';

import GlobalContainer from 'containers/GlobalContainer';
import SubscriptionContainer from 'containers/SubscriptionContainer';
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

const fonts = {
  en: '"Roboto", "Helvetica", "Arial", sans-serif',
  zh: '"Noto Sans SC X", "Noto Sans SC", "Microsoft YaHei", sans-serif',
};

const makeTheme = (fontFamily) => createMuiTheme({
  typography: {
    fontFamily,
  },
  palette: {
    primary: Teal,
    secondary: Brown,
  },
});

const ConnectedMuiThemeProvider = connect(createStructuredSelector({
  theme: createSelector(
    (state) => state.getIn(['language', 'locale']),
    (state) => makeTheme(fonts[state]),
  ),
}))(MuiThemeProvider);

const render = (messages) => {
  ReactDOM.render(
    <Provider store={store}>
      <ErrorBoundary>
        <ConnectedRouter history={history}>
          <ErrorBoundary>
            <Reboot />
            <SubscriptionContainer />
            <ConnectedMuiThemeProvider>
              <LanguageProvider messages={messages}>
                <GlobalContainer />
              </LanguageProvider>
            </ConnectedMuiThemeProvider>
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
