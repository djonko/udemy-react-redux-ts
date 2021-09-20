import { Action } from 'redux';
import { RootState } from './store';

interface RecorderState {
  startDate: string;
}
const START = 'recorder/start';
const STOP = 'recorder/stop';
type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;
type RecorderAction = StartAction | StopAction;

export const start = (): StartAction => ({ type: START });
export const stop = (): StopAction => ({ type: STOP });

export const selectRecorderState = (rootState: RootState) => rootState.recorder;

export const selectDateStart = (rootState: RootState) =>
  selectRecorderState(rootState).startDate;

const initialeState: RecorderState = {
  startDate: '',
};
const recorderReducer = (
  state: RecorderState = initialeState,
  action: RecorderAction
): RecorderState => {
  switch (action.type) {
    case START: {
      return {
        ...state,
        startDate: new Date().toISOString(),
      };
    }
    case STOP: {
      return {
        ...state,
        startDate: '',
      };
    }
    default:
      return state;
  }
};

export default recorderReducer;
