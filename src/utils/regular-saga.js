import { notification } from 'antd';
import { call, put, select } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { getWithArgs, post } from 'common/xFetch2';
import { noop } from 'lodash';

export function createRegularSaga(options = {}) {
  const {
    actionNamePrefix = 'list',
    datasource,
    getDataSource,
    method,
    getExtraQuery = (state, action) => {
      return {};
    }
  } = options;
  return function* defaultSaga() {
    const watches = yield [
      takeEvery(`${actionNamePrefix}/get`, getList),
      takeEvery(`${actionNamePrefix}/search`, getList)
    ];
  };

  function* getList(action) {
    try {
      yield put({
        type: `${actionNamePrefix}/load`
      });

      let query;
      if (action.payload) {
        const {
          successCallBack = noop,
          errorCallBack = noop,
          ...restPayload
        } = action.payload;

        query = restPayload;
      }

      const state = yield select();
      const extraQuery = getExtraQuery(state, action);

      let realMethod = getWithArgs;
      if (method) {
        realMethod = method;
      }
      let realDatasource = datasource;
      if (getDataSource) {
        realDatasource = getDataSource(action);
      }

      const res = yield call(realMethod, realDatasource, {
        ...query,
        ...extraQuery
      });
      if (res.status !== 'success') {
        if (action.payload && action.payload.errorCallBack) {
          action.payload.errorCallBack();
        }
      }

      yield put({
        type: `${actionNamePrefix}/load/success`,
        payload: res.content
      });
      if (action.payload && action.payload.successCallBack) {
        action.payload.successCallBack(res.content);
      }
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  }
}
