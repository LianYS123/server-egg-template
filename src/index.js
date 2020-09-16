/**
 * app.js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';
import './common/modal-draggable';
import './utils/uuid';
import 'styles/index.less';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/erlang-dark.css';
import 'codemirror/addon/display/fullscreen.js';
import 'codemirror/addon/display/fullscreen.css';
import zhCN from 'antd/es/locale/zh_CN';

import { selectLocationState } from './containers/app/selectors';

import App from './containers/app';
import { ConfigProvider } from 'antd';

import createRoutes from './routes';
import SwalNotification from './components/notification/swal-notification';
import "./index.css";
import "./index.less";


const initialState = {};
const store = configureStore(initialState, hashHistory);

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  window.__REDUX_DEVTOOLS_EXTENSION__(store);
} else if (window.devToolsExtension) {
  window.devToolsExtension.updateStore(store);
}

window.SYS_DICTS = {};
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: selectLocationState()
});

const comp = window.location.hash.indexOf('portal/') > -1 ? '' : App;

window.swal = SwalNotification;

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router history={history} routes={{
          component: comp,
          childRoutes: createRoutes(store)
        }}
        />
      </ConfigProvider>
    </Provider>,
    document.getElementById('root')
  );

  setTimeout(() => {
    if (window.isIE9) {
      clearInterval(window.loadingInterval);
    }
    const $loading = document.getElementById('InitLoading');
    if ($loading) {
      $loading.style.display = 'none';
    }
  }, 10);
};
render();