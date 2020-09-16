import { fromJS } from "immutable";

/**
 * [create create table reducer]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */

export function createTableStore(list = []) {
  return {
    loading: false,
    list,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    query: {},
    sorter: {},
    expand: false,
    extendsData: {},
    selectedRowKeys: [],
    selectedRows: [],
    columnsMore: {
      checkedList: [],
      checkAll: false,
      indeterminate: true
    }
  };
}

function updateCache(arr = [], tableDataCache, rowKey = null) {
  if (!(arr instanceof Array)) {
    return;
  }
  arr.forEach(it => {
    if (rowKey) {
      tableDataCache[it[rowKey]] = it;
    } else {
      if (it.sn) {
        tableDataCache[it.sn] = it;
      } else if (it.id || it.ID) {
        tableDataCache[it.id || it.ID] = it;
      }
    }
  });
  return tableDataCache;
}

function populateCache(ids = [], tableDataCache) {
  return ids.map(id => {
    if (tableDataCache[id]) {
      return tableDataCache[id];
    }
  });
}

/**
 * [create description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
export function createTableReducer(actionNamePrefix, keyPath = [], rowKey = null) {
  if (typeof keyPath === "string") {
    keyPath = [keyPath];
  }

  return {
    [actionNamePrefix + "/load"]: (state, action) => {
      return state
        .setIn([ ...keyPath, "loading" ], true)
        .setIn([ ...keyPath, "list" ], []);
    },
    [`${actionNamePrefix}/reset`]: (state, action) => {
      return state.updateIn(keyPath, tableState => {
        return fromJS(createTableStore());
      });
    },
    [`${actionNamePrefix}/toggle/expand`]: (state, action) => {
      return state.updateIn(keyPath, tableState => {
        return tableState.set("expand", !tableState.get("expand"));
      });
    },
    [`${actionNamePrefix}/load/success`]: (state, action) => {
      const payload = action.payload;
      const cache = state.getIn([ ...keyPath, "dataCache" ]) || {};
      const newCache = updateCache(payload.content || [], cache, rowKey);
      return state.updateIn(keyPath, tableState => {
        return tableState
          .set("list", fromJS(payload.content))
          .set("extendsData", fromJS(payload.extendsData))
          .set("dataCache", newCache)
          .update("pagination", pagi => {
            const plainP = pagi.toJS();
            const pagiRemote = {
              ...payload.pagination
            };
            delete pagiRemote.content;

            return fromJS({
              ...plainP,
              ...pagiRemote
            });
          })
          .set("loading", false);
      });
    },
    [`${actionNamePrefix}/set/selectedRows`]: (state, action) => {
      const cache = state.getIn([ ...keyPath, "dataCache" ]) || {};
      return state.updateIn(keyPath, tableState => {
        return (
          tableState
            // .set("selectedRows", fromJS(action.payload.selectedRows))
            .set(
              "selectedRows",
              fromJS(populateCache(action.payload.selectedRowKeys, cache))
            )
            .set("selectedRowKeys", fromJS(action.payload.selectedRowKeys))
        );
      });
    },
    [`${actionNamePrefix}/set/initialSelectedRows`]: (state, action) => {
      const cache = state.getIn([ ...keyPath, "dataCache" ]) || {};
      updateCache(action.payload.selectedRows || [], cache);

      return state.updateIn(keyPath, tableState => {
        return tableState
          .set("selectedRows", fromJS(action.payload.selectedRows))
          .set("selectedRowKeys", fromJS(action.payload.selectedRowKeys));
      });
    },
    [`${actionNamePrefix}/set/selectedRows/all`]: (state, action) => {
      return state.updateIn(keyPath, tableState => {
        const cache = state.getIn([ ...keyPath, "dataCache" ]) || {};
        updateCache(action.payload.selectedRows || [], cache);
        return tableState
          .set("selectedRows", fromJS(action.payload.selectedRows))
          .set("selectedRowKeys", fromJS(action.payload.selectedRowKeys));
      });
    },
    [`${actionNamePrefix}/set-page-size`]: (state, action) => {
      return state.updateIn(keyPath, tableState => {
        return tableState
          .setIn([ "pagination", "pageSize" ], action.payload.pageSize)
          .setIn([ "pagination", "page" ], 1);
      });
    },
    [`${actionNamePrefix}/set-page`]: (state, action) => {
      return state.setIn(
        [ ...keyPath, "pagination", "page" ],
        action.payload.page
      );
    },
    [`${actionNamePrefix}/set-query`]: (state, action) => {
      return state.setIn([ ...keyPath, "query" ], fromJS(action.payload));
    },
    [`${actionNamePrefix}/set-sorter`]: (state, action) => {
      return state.setIn([ ...keyPath, "sorter" ], fromJS(action.payload));
    },
    [`${actionNamePrefix}/set-loading`]: (state, action) => {
      return state.setIn([ ...keyPath, "loading" ], fromJS(action.payload));
    },
    [`${actionNamePrefix}/set-columns-more`]: (state, action) => {
      return state.setIn([ ...keyPath, "columnsMore" ], action.payload); //这里不能fromJS，否则checkedList中的对象不一样了，无法回显
    }
  };
}
