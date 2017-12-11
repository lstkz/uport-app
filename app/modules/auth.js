import {createAction, handleActions} from 'redux-actions';
import {uport} from '../uportSetup';


// ------------------------------------
// Constants
// ------------------------------------
export const LOGGED_IN = 'auth::LOGGED_IN';
export const LOGGED_OUT = 'auth::LOGGED_OUT';
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
  localStorage.user = JSON.stringify(user);
  dispatch({type: LOGGED_IN, payload: user});
};

export const logout = () => async (dispatch) => {
  delete localStorage.user;
  dispatch({type: LOGGED_OUT});
};

export const actions = {
  a: createAction(URI_LOADED),
  login,
  logout,
};

function tryGetUser() {
  try {
    return JSON.parse(localStorage.user);
  } catch (e) {
    return null;
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

export default handleActions({
  [LOGGED_IN]: (state, {payload: user}) => ({...state, user}),
  [LOGGED_OUT]: (state) => ({...state, user: null}),
  [URI_LOADED]: (state, {payload: uri}) => ({...state, loginUri: uri}),

}, {
  user: tryGetUser(),
  loginUri: null,
});
