// @flow
import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';
import auth from './auth';
import submit from './submit';
import download from './download';

const rootReducer = combineReducers({
  auth,
  router,
  submit,
  download,
});

export default rootReducer;
