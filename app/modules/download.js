import {createAction, handleActions} from 'redux-actions';
import {decryptSubmissionData, checkKeyValid} from '../utils/encrypt';
import {verifyHash} from '../utils/file-hash';
import downloadUrl from '../utils/download';
import api from '../api';

const {dialog} = require('electron').remote;

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CHALLENGE_ID = 'download::SET_CHALLENGE_ID';
export const GO_PREV_STEP = 'download::GO_PREV_STEP';
export const SHOW_LOADING = 'download::SHOW_LOADING';
export const HIDE_LOADING = 'download::HIDE_LOADING';
export const SHOW_ERROR = 'download::SHOW_ERROR';
export const CLOSE_ERROR = 'download::CLOSE_ERROR';
export const CHALLENGE_LOADED = 'download::CHALLENGE_LOADED';
export const SET_PRIVATE_KEY = 'download::SET_PRIVATE_KEY';
export const SHOW_SUBMISSIONS = 'download::SHOW_SUBMISSIONS';


// ------------------------------------
// Actions
// ------------------------------------

export const fetchSubmissions = () => async (dispatch, getState) => {
  const {challengeId} = getState().download;
  dispatch({type: SHOW_LOADING});
  try {
    const result = await api.getChallengeWithSubmissions(challengeId);
    if (!result.submissions.length)  {
      dispatch({type: SHOW_ERROR, payload: `Challenge "${result.title}" does not have any submissions`});
    } else {
      dispatch({type: CHALLENGE_LOADED, payload: result});
    }
  } catch (e) {
    console.log(e.stack);
    dispatch({type: SHOW_ERROR, payload: 'Failed to get a challenge'});
  }
  dispatch({type: HIDE_LOADING});
};

export const checkKey = () => async (dispatch, getState) => {
  const {challengeDetails, privateKey} = getState().download;
  if (!checkKeyValid(challengeDetails.publicKey, privateKey)) {
    dispatch({type: SHOW_ERROR, payload: 'Provided key is invalid or does no belong to this challenge'});
  } else {
    dispatch({type: SHOW_SUBMISSIONS});
  }
};

export const download = (sub) => async (dispatch, getState) => {
  const {privateKey} = getState().download;
  let submissionData;
  try {
    submissionData = decryptSubmissionData(sub.data, privateKey);
  } catch (e) {
    console.error(e.stack);
    dispatch({type: SHOW_ERROR, payload: 'Cannot decrypt submission.'});
    return;
  }
  const split = submissionData.url.split('_');
  const fileName = split[split.length - 1];
  const savePath = await new Promise(resolve =>
    dialog.showSaveDialog(null, {defaultPath: fileName}, resolve));
  if (!savePath) {
    return;
  }
  dispatch({type: SHOW_LOADING});
  try {
    await downloadUrl(savePath, submissionData.url);
  } catch (e) {
    console.error(e.stack);
    dispatch({type: SHOW_ERROR, payload: 'Failed to download the file. Please try again.'});
    return;
  }
  if (!await verifyHash(savePath, submissionData.hash)) {
    dispatch({type: SHOW_ERROR, payload: 'File hash is invalid!'});
    return;
  }
  dispatch({type: HIDE_LOADING});
};

export const actions = {
  setChallengeId: createAction(SET_CHALLENGE_ID),
  closeError: createAction(CLOSE_ERROR),
  goPrevStep: createAction(GO_PREV_STEP),
  setPrivateKey: createAction(SET_PRIVATE_KEY),
  fetchSubmissions,
  checkKey,
  download,
};


// ------------------------------------
// Reducer
// ------------------------------------

function getDefaultState() {
  return {
    step: 0,
    challengeId: null,
    privateKey: null,
    challengeDetails: null,
    submissions: [],
    isLoading: false,
    lastError: null,
    error: null,
    showList: false,
  };
}

export default handleActions({
  '@@router/LOCATION_CHANGE': () => getDefaultState(),
  [SET_CHALLENGE_ID]: (state, {payload: challengeId}) => ({...state, challengeId}),
  [SET_PRIVATE_KEY]: (state, {payload: privateKey}) => ({...state, privateKey}),
  [SHOW_LOADING]: (state) => ({...state, isLoading: true}),
  [HIDE_LOADING]: (state) => ({...state, isLoading: false}),
  [SHOW_ERROR]: (state, {payload: lastError}) =>
    ({...state, error: true, lastError, isLoading: false}),
  [CLOSE_ERROR]: (state) => ({...state, error: false}),
  [GO_PREV_STEP]: (state) => ({...state, step: state.step - 1}),
  [SHOW_SUBMISSIONS]: (state) => ({...state, step: 2}),
  [CHALLENGE_LOADED]: (state, {payload: challengeDetails}) =>
    ({...state, challengeDetails, submissions: challengeDetails.submissions, step: 1}),
}, getDefaultState());
