import { Action } from "redux";
import { AnyAction } from "redux";

interface RecorderState {
    startDate: string
    endDate: string
}
const START = "recorder/start"
const STOP = "recorder/stop"
type StartAction = Action<typeof START>
type StopAction = Action<typeof STOP>
type RecorderAction = StartAction | StopAction
export const start = (): StartAction => ({ type: START })
export const stop = (): StopAction => ({ type: STOP })
const recorderReducer = (state: RecorderState, action: RecorderAction): RecorderState => {

    switch (action.type) {

        case START: {
            return {
                ...state,
                startDate: new Date().toISOString()
            }
        }
        case STOP: {
            return {
                ...state,
                startDate: ''
            }
        }
        default:
            return state;
    }
}

export default recorderReducer