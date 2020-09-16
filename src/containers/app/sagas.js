import { call, put, select } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import cookie from 'js-cookie';
import moment from 'moment';
import { notification } from 'antd';
import { Base64 } from 'js-base64';
import { get } from 'common/xFetch2';
import * as auth from 'services/auth';

function* checkLogin() {
  try {
    const token = localStorage.DCOS_ACCESS_TOKEN || cookie.get('access-token');
    const hash = window.location.hash;

    //跳转登录可以设置未登录屏障
    if (
      (!token || token === 'undefined') &&
      hash.indexOf('/authenticated') === -1 &&
      hash.indexOf('/login') === -1
    ) {
      yield put({
        type: 'global/login/first',
        payload: false
      });
    } else {
      yield put({
        type: 'global/login/first',
        payload: true
      });
    }

    //检查登录状态查询licenses
    if (token && token !== 'undefined') {
      const res = yield call(get, `/api/cloudboot/v3/licenses`);
      if (res.status !== 'success') {
        return window.swal('error', res.message);
      }
      if (res.content.error_message) {
        window.swal('error', res.content.error_message);
      }
      yield put({
        type: 'global/set-license',
        payload: res.content
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}


function checkTokenExpiration() {
  const token = localStorage.DCOS_ACCESS_TOKEN || cookie.get('access-token');
  if (token && token !== 'undefined') {
    const data = token.split('.')[1];
    const addStr = ''.padEnd(
      data.length % 4 === 0 ? 0 : 4 - (data.length % 4),
      '='
    );
    const expTime = Base64.decode(data.concat(addStr)).match(/"exp":(\d*),/);
    if (expTime && moment().unix() > parseInt(expTime[1], 10)) {
      notification.error({ message: '用户身份过期，请重新登录' });
      localStorage.clear();
      cookie.remove('access-token', '');
      auth.ssoLogin();
    }
  }
}

function* onLogout(action) {
  const state = yield select();
  const accountID = state.getIn([ 'global', 'userData', 'id' ]) || '';
  auth.logout(accountID);
}

//获取全部字典
function* getDictAll(action) {
  try {
    const res = yield call(get, '/api/cloudboot/v3/sys-dicts-types');
    if (res.status !== 'success') {
      return notification.error({ message: res.message });
    }
    const data = res.content.sys_dicts;
    const newData = {};
    for (let item in data) {
      newData[item + '_json'] = {};
      data[item].forEach(it => {
        newData[item + '_json'][it.value] = it.name;
      });
      data[item].map(o => (o.label = o.name));
    }
    window.SYS_DICTS = { ...data, ...newData };
    if (action.payload && action.payload.cb) {
      action.payload.cb();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

/**
 * Individual exports for testing
 * @yield {[type]} [description]
 */
function* defaultSaga() {
  const watchers = yield [
    takeEvery('global/checkLogin', checkLogin),
    takeEvery('global/checkTokenExpiration', checkTokenExpiration),
    takeEvery('global/logout', onLogout),
    takeEvery('global/getDictAll', getDictAll)
  ];
  return;
}

export default defaultSaga;
