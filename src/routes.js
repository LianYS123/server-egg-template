
// import Err404 from "containers/common/err404/get-component";
// import Err404 from 'containers/setting/license/get-component';

import Homepage from 'containers/homepage/get-component';
import errorLoading from './common/load-route-error';
import { getAsyncInjectors } from './utils/asyncInjectors';

export default function createRoutes(store) {
  const { injectReducer, injectSagas } = getAsyncInjectors(store);
  const options = {
    injectReducer,
    injectSagas,
    errorLoading
  };

  // const data = store.getState().toJS().global;
  // const permissions = data.userData ? data.userData.permissions : [];

  return [
    {
      path: '/',
      name: '概览',
      getComponent: Homepage(options)
    }
  ]
}
