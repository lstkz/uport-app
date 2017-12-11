// @flow
import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';
import auth from './auth';
import submit from './submit';

const rootReducer = combineReducers({
  auth,
  router,
  submit,
});

export default rootReducer;
