import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { getWithArgs } from 'common/xFetch2';

export function createTableSaga(options = {}) {
  const {
    actionNamePrefix = 'table',
    tableDataPath = ['tableData'], // ["project", "tableData"]
    datasource,
    fetchMethod = getWithArgs,
    noMoreQuery,
    pageParameter,
    defaultPageSize,
    extendsData,
    getDataSource,
    getExtraQuery = (state, action) => {
      return {};
    } // 在查询 table 数据的时候需要获取额外的数据
  } = options;
  return function* defaultSaga() {
    const watchers = yield [
      takeEvery(`${actionNamePrefix}/change-page-size`, changePageSize),
      takeEvery(`${actionNamePrefix}/change-page`, changePage),
      takeEvery(`${actionNamePrefix}/search`, search),
      takeEvery(`${actionNamePrefix}/clearSearch`, clearSearch),
      takeEvery(`${actionNamePrefix}/reload`, reload),
      takeEvery(`${actionNamePrefix}/sort`, sort),
      takeEvery(`${actionNamePrefix}/get`, getTableData)
    ];
  };

  function* getTableData(action) {
    try {
      const state = yield select();
      yield put({
        type: `${actionNamePrefix}/load`
      });

      const pagination = state.getIn([ ...tableDataPath, 'pagination' ]).toJS();

      const extraQuery = getExtraQuery(state, action);
      let query = state.getIn([ ...tableDataPath, 'query' ]);
      let sorter = state.getIn([ ...tableDataPath, 'sorter' ]);
      let schema = state.getIn([ ...tableDataPath, 'schema' ]) || {};
      schema = schema.toJS ? schema.toJS() : schema;

      if (query) {
        query = query.toJS();
      } else {
        query = {};
      }

      if (sorter) {
        sorter = sorter.toJS();
        if (sorter.field) {
          sorter = {
            sortField: window.encodeURIComponent(sorter.field),
            sortOrder: sorter.order
          };
        } else {
          sorter = {};
        }
      } else {
        sorter = {};
      }

      let realDatasource = schema.datasource || datasource;
      if (typeof getDataSource === 'function') {
        realDatasource = getDataSource(state, action);
      }
      const fetch = options.fetchMethod || getWithArgs;

      //boot新的接口分页参数传page，page_size，旧的接口传Limit,Offset,Offset从0开始
      let pageSizeKey = 'page_size';
      let pageKey = 'page';
      let page = pagination.page;
      if (pageParameter) {
        pageKey = pageParameter.page;
        pageSizeKey = pageParameter.pageSize;
        page = page - 1;
      }
      let pageSize = pagination.pageSize;
      if (defaultPageSize) {
        pageSize = defaultPageSize.pageSize;
      }
      // 接口可能不支持传入limit, page 等额外属性，因此需要加个判断，虽然丑了点
      const ret = yield call(
        fetch,
        realDatasource,
        noMoreQuery
          ? { ...extraQuery }
          : {
            ...query,
            ...extraQuery,
            ...sorter,
            [pageKey]: page,
            [pageSizeKey]: pageSize,
            cb: null
          }
      );

      if (ret.status !== 'success') {
        yield put({
          type: `${actionNamePrefix}/set-loading`,
          payload: false
        });
      }

      const content = ret.content;

      yield put({
        type: `${actionNamePrefix}/load/success`,
        payload: {
          content: content.records || [],
          extendsData: content[extendsData] || {},
          pagination: {
            pageSize: content.page_size || pagination.pageSize,
            page: content.page || pagination.page,
            total: content.total_records || content.recordCount
          }
        }
      });
      if (action && action.payload && action.payload.cb) {
        action.payload.cb(ret);
      }
    } catch (error) {
      yield put({
        type: `${actionNamePrefix}/set-loading`,
        payload: false
      });
    }
  }
  function* changePageSize(action) {
    yield put({
      type: `${actionNamePrefix}/set-page-size`,
      payload: action.payload
    });

    yield call(getTableData);
  }

  function* changePage(action) {
    yield put({
      type: `${actionNamePrefix}/set-page`,
      payload: action.payload
    });

    yield call(getTableData);
  }

  function* search(action) {
    yield [
      put({
        type: `${actionNamePrefix}/set-query`,
        payload: action.payload
      }),
      put({
        type: `${actionNamePrefix}/set-page`,
        payload: {
          page: 1
        }
      })
    ];

    yield call(getTableData);
  }

  function* reload(action) {
    yield put({
      type: `${actionNamePrefix}/reset`
    });

    yield call(getTableData);
  }

  // 清楚搜索框字符，不reload
  function* clearSearch(action) {
    yield [
      put({
        type: `${actionNamePrefix}/set-query`,
        payload: action.payload
      }),
      put({
        type: `${actionNamePrefix}/set-page`,
        payload: {
          page: 1
        }
      })
    ];
  }

  function* sort(action) {
    yield [
      put({
        type: `${actionNamePrefix}/set-sorter`,
        payload: action.payload
      }),
      put({
        type: `${actionNamePrefix}/set-page`,
        payload: {
          page: 1
        }
      })
    ];
    yield call(getTableData);
  }
}
