import {createAction, handleActions} from 'redux-actions';
import {encryptSubmissionData} from '../utils/encrypt';
import waitForMined from '../utils/waitForMined';
import {getHash} from '../utils/file-hash';
import upload from '../utils/upload';
import api from '../api';

const {dialog} = require('electron').remote;

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CHALLENGE_ID = 'submit::SET_CHALLENGE_ID';
export const GO_PREV_STEP = 'submit::GO_PREV_STEP';
export const SHOW_LOADING = 'submit::SHOW_LOADING';
export const HIDE_LOADING = 'submit::HIDE_LOADING';
export const SHOW_ERROR = 'submit::SHOW_ERROR';
export const CLOSE_ERROR = 'submit::CLOSE_ERROR';
export const CHALLENGE_LOADED = 'submit::CHALLENGE_LOADED';
export const UPLOADED = 'submit::UPLOADED';
export const SUCCESS = 'submit::SUCCESS';


// ------------------------------------
// Actions
// ------------------------------------

export const getChallenge = () => async (dispatch, getState) => {
  const {challengeId} = getState().submit;
  dispatch({type: SHOW_LOADING});
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

export const confirm = () => async (dispatch, getState) => {
  const {uploadDetails, challengeId, challengeDetails} = getState().submit;
  const data = encryptSubmissionData(uploadDetails, challengeDetails.publicKey);
  const tx = await api.addSubmission(challengeId, data);
  dispatch({type: SHOW_LOADING});
  waitForMined(tx, {blockNumber: null}, () => {
    // pending
  }, () => {
    dispatch({type: HIDE_LOADING});
    dispatch({type: SUCCESS});
  });
};

export const actions = {
  setChallengeId: createAction(SET_CHALLENGE_ID),
  goPrevStep: createAction(GO_PREV_STEP),
  closeError: createAction(CLOSE_ERROR),
  getChallenge,
  selectFile,
  confirm,
};


// ------------------------------------
// Reducer
// ------------------------------------

function getDefaultState() {
  return {
    step: 0,
    challengeId: null,
    challengeDetails: null,
    isLoading: false,
    lastError: null,
    error: null,
    uploadDetails: null,
  };
}

export default handleActions({
  '@@router/LOCATION_CHANGE': () => getDefaultState(),
  [SET_CHALLENGE_ID]: (state, {payload: challengeId}) => ({...state, challengeId}),
  [GO_PREV_STEP]: (state) => ({...state, step: state.step - 1}),
  [SHOW_LOADING]: (state) => ({...state, isLoading: true}),
  [HIDE_LOADING]: (state) => ({...state, isLoading: false}),
  [SHOW_ERROR]: (state, {payload: lastError}) =>
    ({...state, error: true, lastError, isLoading: false}),
  [CLOSE_ERROR]: (state) => ({...state, error: false}),
  [CHALLENGE_LOADED]: (state, {payload: challengeDetails}) =>
    ({...state, challengeDetails, step: 1}),
  [UPLOADED]: (state, {payload: uploadDetails}) => ({...state, uploadDetails, step: 2}),
  [SUCCESS]: (state) => ({...state, step: 3}),
}, getDefaultState());
