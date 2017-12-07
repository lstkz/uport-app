import {createAction, handleActions} from 'redux-actions';
import { uport } from '../uportSetup';



// ------------------------------------
// Constants
// ------------------------------------
export const LOGGED_IN = 'auth::LOGGED_IN';
export const INIT = 'auth::LOAD_DIRECTORIES';
export const URI_LOADED = 'auth::URI_LOADED';



// ------------------------------------
// Actions
// ------------------------------------


export const login = () => async (dispatch) => {
  const user = await uport.requestCredentials(
    {
      requested: ['name', 'avatar', 'phone', 'country'],
      notifcations: true
    });
  dispatch({type: LOGGED_IN, payload: user});
};


export const actions = {
  a: createAction(URI_LOADED),
  login
};


// ------------------------------------
// Reducer
// ------------------------------------

export default handleActions({
  [LOGGED_IN]: (state, { payload: user }) => ({ ...state, user }),
  [URI_LOADED]: (state, { payload: uri }) => ({ ...state, loginUri: uri }),

}, {
  user: null,
  loginUri: null,
});
