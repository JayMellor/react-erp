import { createStore, Reducer } from 'redux';

export const ADD_SOMETHING = 'ADD_SOMETHING';
export const REMOVE_SOMETHING = 'REMOVE_SOMETHING';

// ACTIONS

export interface AddSomethingAction {
    type: typeof ADD_SOMETHING;
    payload: string;
}

export interface RemoveSomethingAction {
    type: typeof REMOVE_SOMETHING;
}

type SomethingActions = AddSomethingAction | RemoveSomethingAction;

// STATE

export interface SomethingState {
    something: string;
}

const defaultState: SomethingState = {
    something: '',
};

// REDUCER

const rootReducer: Reducer<SomethingState, SomethingActions> = (
    state: SomethingState | undefined,
    action: SomethingActions,
): SomethingState => {
    switch (action.type) {
        case ADD_SOMETHING:
            return { something: action.payload };
        case REMOVE_SOMETHING:
            return defaultState;
        default:
            return defaultState;
    }
};

export const store = createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);
