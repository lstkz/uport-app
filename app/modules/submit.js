import {createAction, handleActions} from 'redux-actions';
import {getHash} from '../utils/file-hash';
import upload from '../utils/upload';
import api from '../api';

const {dialog} = require('electron').remote;

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CHALLENGE_ID = 'auth::SET_CHALLENGE_ID';
export const GO_PREV_STEP = 'auth::GO_PREV_STEP';
export const SHOW_LOADING = 'auth::SHOW_LOADING';
export const HIDE_LOADING = 'auth::HIDE_LOADING';
export const SHOW_ERROR = 'auth::SHOW_ERROR';
export const CLOSE_ERROR = 'auth::CLOSE_ERROR';
export const CHALLENGE_LOADED = 'auth::CHALLENGE_LOADED';
export const UPLOADED = 'auth::UPLOADED';


// ------------------------------------
// Actions
// ------------------------------------

export const goNext = () => async (dispatch, getState) => {
  const {step, challengeId} = getState().submit;
  dispatch({type: SHOW_LOADING});
  switch (step) {
    case 0: {
      try {
        const result = await api.getChallenge(challengeId);
        if (result.deadline.getTime() < Date.now()) {
          dispatch({type: SHOW_ERROR, payload: `Challenge "${result.title}" is not active`});
        } else {
          dispatch({type: CHALLENGE_LOADED, payload: result});
        }
      } catch (e) {
        console.log(e.stack);
        dispatch({type: SHOW_ERROR, payload: 'Failed to get a challenge'});
      }
      break;
    }
    // no default
  }
  dispatch({type: HIDE_LOADING});
};


export const selectFile = () => async (dispatch) => {
  const paths = await new Promise(resolve => dialog.showOpenDialog(resolve));
  if (!paths) {
    return;
  }
  if (paths.length !== 1) {
    dispatch({type: SHOW_ERROR, payload: 'Select only a single file'});
    return;
  }
  const filePath = paths[0];
  dispatch({type: SHOW_LOADING});
  try {
    const hash = await getHash(filePath);
    const url = await upload(hash, filePath);
    dispatch({type: UPLOADED, payload: {hash, url}});
    dispatch({type: HIDE_LOADING});
  } catch (e) {
    console.log(e.stack);
    dispatch({type: SHOW_ERROR, payload: e.message});
  }
};

export const actions = {
  setChallengeId: createAction(SET_CHALLENGE_ID),
  goPrevStep: createAction(GO_PREV_STEP),
  closeError: createAction(CLOSE_ERROR),
  goNext,
  selectFile,
};


// ------------------------------------
// Reducer
// ------------------------------------

export default handleActions({
  [SET_CHALLENGE_ID]: (state, {payload: challengeId}) => ({...state, challengeId}),
  [GO_PREV_STEP]: (state) => ({...state, step: state.step - 1}),
  [SHOW_LOADING]: (state) => ({...state, isLoading: true}),
  [HIDE_LOADING]: (state) => ({...state, isLoading: false}),
  [SHOW_ERROR]: (state, {payload: lastError}) =>
    ({...state, error: true, lastError, isLoading: false}),
  [CLOSE_ERROR]: (state) => ({...state, error: false}),
  [CHALLENGE_LOADED]: (state, {payload: challengeDetails}) =>
    ({...state, challengeDetails, step: 1}),
  [UPLOADED]: (state, {payload: uploadDetails}) => ({...state, uploadDetails}),
}, {
  step: 0,
  challengeId: null,
  challengeDetails: null,
  isLoading: false,
  lastError: null,
  error: null,
  uploadDetails: null,
});
