/**
 * Redux Reducer for state.page.challengeDetails.submission
 *
 * Description:
 *   Implements state reducers for the Challenge Submission page
 *   and handles the Challenge Submission actions
 */

import _ from 'lodash';
import actions from 'actions/page/challenge-details/submission';

import { handleActions } from 'redux-actions';

/**
 * Handles results of PAGE/CHALLENGE_DETAILS/SUBMISSION/SUBMIT_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onSubmitDone(state, action) {
  if (action.payload.error) {
    return {
      ...state,
      submitErrorMsg: action.payload.error.details || action.payload.error.name,
      isSubmitting: false,
      submitDone: false,
    };
  }

  return {
    ...state,
    ...action.payload,
    isSubmitting: false,
    submitDone: true,
  };
}

/**
 * Handles results of PAGE/CHALLENGE_DETAILS/SUBMISSION/SUBMIT_INIT action.
 * @param {Object} state
 * @return {Object} New state.
 */
function onSubmitInit(state) {
  return {
    ...state,
    isSubmitting: true,
    submitDone: false,
    submitErrorMsg: '',
    uploadProgress: 0,
  };
}

/**
 * Handles results of PAGE/CHALLENGE_DETAILS/SUBMISSION/SUBMIT_DONE action.
 * @param {Object} state
 * @return {Object} New state.
 */
function onSubmitReset(state) {
  return {
    ...state,
    isSubmitting: false,
    submitDone: false,
    submitErrorMsg: '',
    uploadProgress: 0,
  };
}

/**
 * Handles results of PAGE/CHALLENGE_DETAILS/SUBMISSION/SUBMIT_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onUploadProgress(state, action) {
  return {
    ...state,
    uploadProgress: action.payload,
  };
}

/**
 * Returns a new state with the filePicker updated according to map, or added if not existing
 * @param {Object} state Current state
 * @param {String} id ID of the <FilePicker>
 * @param {Object} map Key value pairs for the new FilePicker state
 * @return New state
 */
function fpSet(state, id, map) {
  let found = false;

  const newFilePickers = state.filePickers.map((fp) => {
    if (fp.id === id) {
      found = true;
      return ({
        ...fp,
        ...map,
      });
    }
    return fp;
  });

  if (found) {
    return ({ ...state, filePickers: newFilePickers });
  }

  return ({
    ...state,
    filePickers: [
      ...newFilePickers,
      { id, ...map },
    ],
  });
}

/**
 * Returns a new state with the Input at index updated according to map.
 * @param {Object} state Current state
 * @param {String} id ID of the <MultiInput>
 * @param {Number} index Index of the <AddFontInput> or <AddStockInput>
 * @param {Object} map Key value pairs for the new state
 * @return New state
 */
function multiInputSet(state, id, index, map) {
  const newMultiInputs = state.multiInputs.map((multi) => {
    if (multi.id === id) {
      return ({
        ...multi,
        inputs: [
          ...multi.inputs.slice(0, index),
          { ...(multi.inputs[index] || {}), ...map },
          ...multi.inputs.slice(index + 1),
        ],
      });
    }
    return multi;
  });

  return ({ ...state, multiInputs: newMultiInputs });
}

/**
 * Handles results of PAGE/CHALLENGE_DETAILS/SUBMISSION/REMOVE_MULTI_INPUT action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onRemoveMultiInput(state, action) {
  const {
    id,
    index,
  } = action.payload;

  const newMultiInputs = state.multiInputs.map((multi) => {
    if (multi.id === id) {
      return ({
        ...multi,
        inputs: [
          ...multi.inputs.slice(0, index),
          ...multi.inputs.slice(index + 1),
        ],
      });
    }
    return multi;
  });

  return ({ ...state, multiInputs: newMultiInputs });
}

/**
 * Creates a new submission reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return submission reducer.
 */
function create(initialState) {
  const a = actions.page.challengeDetails.submission;

  return handleActions({
    [a.submitDone]: onSubmitDone,
    [a.submitInit]: onSubmitInit,
    [a.submitReset]: onSubmitReset,
    [a.uploadProgress]: onUploadProgress,
    [a.setAgreed]: (state, action) => ({ ...state, agreed: action.payload }),
    [a.setFilePickerError]:
      (state, { payload }) => fpSet(state, payload.id, { error: payload.error }),
    [a.setFilePickerFileName]:
      (state, { payload }) => fpSet(state, payload.id, { fileName: payload.fileName }),
    [a.setFilePickerDragged]:
      (state, { payload }) => fpSet(state, payload.id, { dragged: payload.dragged }),
    [a.updateNotesLength]: (state, action) => ({ ...state, notesLength: action.payload }),
    [a.removeMultiInput]: onRemoveMultiInput,
    [a.setMultiInputUrlValid]: (state, { payload }) =>
      multiInputSet(state, payload.id, payload.index, { urlValid: payload.valid }),
    [a.setMultiInputNameValid]: (state, { payload }) =>
      multiInputSet(state, payload.id, payload.index, { nameValid: payload.valid }),
    [a.setMultiInputSourceValid]: (state, { payload }) =>
      multiInputSet(state, payload.id, payload.index, { sourceValid: payload.valid }),
    [a.setMultiInputActive]: (state, { payload }) =>
      multiInputSet(state, payload.id, payload.index, { active: payload.active }),
    [a.setSubmissionFilestackData]:
      (state, { payload }) => ({ ...state, submissionFilestackData: payload }),
    [a.setSourceFilestackData]:
      (state, { payload }) => ({ ...state, sourceFilestackData: payload }),
    [a.setPreviewFilestackData]:
      (state, { payload }) => ({ ...state, previewFilestackData: payload }),
  }, _.defaults(_.clone(initialState) || {}, {
    isSubmitting: false,
    submitDone: false,
    submitErrorMsg: '',
    agreed: false,
    notesLength: 0,
    uploadProgress: 0,
    multiInputs: [ // Page defaults are one inactive FontInput and one inactive StockArtInput
      {
        id: 'multi-input-fonts',
        inputs: [{
          active: false,
          urlValid: false,
          nameValid: false,
          sourceValid: false,
        }],
      },
      {
        id: 'multi-input-stock-art',
        inputs: [{
          active: false,
          urlValid: false,
          nameValid: false,
          sourceValid: false,
        }],
      },
    ],
    filePickers: [],
    submissionFilestackData: {
      filename: '',
      mimetype: '',
      size: 0,
      key: '',
      container: '',
    },
    sourceFilestackData: {
      filename: '',
      mimetype: '',
      size: 0,
      key: '',
      container: '',
    },
    previewFilestackData: {
      filename: '',
      mimetype: '',
      size: 0,
      key: '',
      container: '',
    },
  }));
}

export function factory() {
  // Server-side not implemented yet
  return Promise.resolve(create());
}

export default create();
