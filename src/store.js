/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import globalSaga from 'containers/app/sagas';

const sagaMiddleware = createSagaMiddleware();
const devtools = window.__REDUX_DEVTOOLS_EXTENSION__ || (() => (noop) => noop);

export default function configureStore(initialState = {}, history) {
  const middlewares = [
    thunkMiddleware,
    sagaMiddleware,
    routerMiddleware(history)
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools()
  ];

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    compose(...enhancers)
  );

  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {}; // Async reducer registry

  store.runSaga(globalSaga);
  const nextReducers = createReducer(store.asyncReducers);
  store.replaceReducer(nextReducers);

  return store;
}
