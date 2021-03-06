import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { selectDateStart } from "./recorder"
import { RootState } from "./store"

export interface UserEvent {
    id: number;
    title: string;
    dateStart: string;
    dateEnd: string;
}
interface UserEventsState {
    byIds: Record<UserEvent['id'], UserEvent>
    allIds: UserEvent['id'][]
}
const LOAD_REQUEST = 'userEvents/load_request'
interface LoadRequestAction extends Action<typeof LOAD_REQUEST> { }
const LOAD_SUCCESS = 'userEvents/load_success'

interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
    payload: {
        events: UserEvent[]
    }
}
const LOAD_FAILURE = 'userEvents/load_failure'
interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
    error: String
}
type EventAction = LoadRequestAction | LoadSuccessAction | LoadFailureAction | CreateRequestAction | CreateSuccessAction | CreateFailureAction
    | DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction |
    UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction

const selectUserEventsState = (rootState: RootState) => rootState.userEvents
export const selectUserEventsArray = (rootState: RootState) => {
    const state = selectUserEventsState(rootState);
    return state.allIds.map(id => state.byIds[id]);
}

//dispatch function
export const loadUserEvents = (): ThunkAction<void, RootState, undefined, EventAction> => async (dispatch) => {
    dispatch({
        type: LOAD_REQUEST
    });
    try {
        const response = await fetch('http://localhost:3001/events');
        const events: UserEvent[] = await response.json()
        dispatch({
            type: LOAD_SUCCESS,
            payload: { events }
        });
    } catch (e) {
        dispatch({
            type: LOAD_FAILURE,
            error: "Failed to load events."
        })
    }

}

const CREATE_REQUEST = 'userEvents/create_request'
const CREATE_SUCCESS = 'userEvents/create_success'
const CREATE_FAILURE = 'userEvents/create_failure'

const DELETE_REQUEST = 'userEvents/delete_request'
const DELETE_SUCCESS = 'userEvents/delete_success'
const DELETE_FAILURE = 'userEvents/delete_failure'

const UPDATE_REQUEST = 'userEvents/update_request'
const UPDATE_SUCCESS = 'userEvents/update_success'
const UPDATE_FAILURE = 'userEvents/update_failure'

interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> { }
interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
    payload: { id: UserEvent['id'] }
}
interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {
    error: String
}

interface CreateRequestAction extends Action<typeof CREATE_REQUEST> { }
interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
    payload: { event: UserEvent }
}
interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {
    error: String
}

interface UpdateRequestAction extends Action<typeof UPDATE_REQUEST> { }
interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
    payload: { event: UserEvent }
}
interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {
    error: String
}

type CreateEventAction = CreateRequestAction | CreateSuccessAction | CreateFailureAction
type DeleteEventAction = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
type UpdateEventAction = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction

export const createUserEvent = (): ThunkAction<Promise<void>, RootState, undefined, CreateEventAction> => async (dispatch, getState) => {
    dispatch({
        type: CREATE_REQUEST
    })
    try {
        const dateStart = selectDateStart(getState())
        const event: Omit<UserEvent, 'id'> = {
            title: "No name",
            dateStart,
            dateEnd: new Date().toISOString()
        }
        const response = await fetch(
            `http://localhost:3001/events`,
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) }
        )
        const createdEvent: UserEvent = await response.json();
        dispatch({
            type: CREATE_SUCCESS,
            payload: { event: createdEvent }
        })
    } catch (e) {
        dispatch({
            type: CREATE_FAILURE,
            error: "Failed to create event."
        })
    }
}

export const deleteUserEvent = (id: UserEvent['id']): ThunkAction<Promise<void>, RootState, undefined, DeleteEventAction> => async (dispatch, getState) => {
    dispatch({
        type: DELETE_REQUEST
    })
    try {
        const response = await fetch(`http://localhost:3001/events/${id}`, { method: "DELETE" })
        if (response.ok) {
            dispatch({
                type: DELETE_SUCCESS,
                payload: { id }
            })
        }
    } catch (e) {
        dispatch({
            type: DELETE_FAILURE,
            error: "Failed to delete event."
        })
    }
}


export const updateUserEvent = (event: UserEvent): ThunkAction<Promise<void>, RootState, undefined, UpdateEventAction> => async (dispatch, getState) => {
    dispatch({
        type: UPDATE_REQUEST
    })

    try {
        const response = await fetch(
            `http://localhost:3001/events/${event.id}`,
            { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) }
        )
        if (response.ok) {
            const updatedEvent: UserEvent = await response.json();
            dispatch({
                type: UPDATE_SUCCESS,
                payload: { event: updatedEvent }
            })
        }
    } catch (e) {
        dispatch({
            type: UPDATE_FAILURE,
            error: "Failed to update event."
        })
    }
}

const initialState: UserEventsState = {
    byIds: {},
    allIds: []
}


const userEventsReducer = (state: UserEventsState = initialState, action: EventAction): UserEventsState => {
    switch (action.type) {
        case LOAD_SUCCESS:
            {
                const { events } = action.payload
                return {
                    ...state,
                    allIds: events.map(({ id }) => id),
                    byIds: events.reduce<UserEventsState['byIds']>((byIds, currentEvent) => { byIds[currentEvent.id] = currentEvent; return byIds }, {})
                }
            }
        case CREATE_SUCCESS: {
            const { event } = action.payload
            return {
                ...state,
                allIds: [...state.allIds, event.id],
                byIds: { ...state.byIds, [event.id]: event }
            }
        }
        case DELETE_SUCCESS: {
            const { id } = action.payload
            const newState: UserEventsState = {
                ...state,
                byIds: { ...state.byIds },
                allIds: state.allIds.filter(storeId => storeId !== id)
            }
            delete newState.byIds[id]
            return newState
        }
        case UPDATE_SUCCESS: {
            const { event: updatedEvent } = action.payload
            return {
                ...state,
                byIds: { ...state.byIds, [updatedEvent.id]: updatedEvent }
            }
        }

        default:
            return state
    }
}

export default userEventsReducer