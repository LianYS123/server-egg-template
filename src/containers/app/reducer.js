import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { createTableStore, createTableReducer } from 'utils/table-reducer';

const initialState = fromJS({
  loading: true,
  userData: {},
  license: {},
  login: false,
  dict: {}
});

const reducer = handleActions(
  {
    'global/set-user/load': (state, action) => {
      return state.set('loading', true);
    },
    'global/set-user': (state, action) => {
      return state
        .set('userData', fromJS(action.payload))
        .set('loading', false);
    },
    'global/clear-user': (state, action) => {
      return state.set('userData', fromJS({}));
    },
    'global/login/first': (state, action) => {
      return state.set('login', action.payload);
    },
    'global/set-license': (state, action) => {
      return state.set('license', fromJS(action.payload));
    }
  },
  initialState
);

reducer.NAME = 'global';

export default reducer;
