import { Reducer } from 'redux';

// MODEL

type DuplicateReferenceError = {
    error: 'DUPLICATE_REFERENCE';
    reference: string;
};

type EmptyReferenceError = {
    error: 'EMPTY_REFERENCE';
};

export type ReferenceError = DuplicateReferenceError | EmptyReferenceError;

export type ReferenceInvalid = {
    valid: false;
} & ReferenceError;

export type ReferenceValid = {
    valid: true;
    value: string;
};

type NotANumberError = {
    error: 'NOT_A_NUMBER';
};

type InvalidNumberError = {
    error: 'INVALID_NUMBER';
    quantity: number;
};

type QuantityError = NotANumberError | InvalidNumberError;

export type QuantityInvalid = {
    valid: false;
} & QuantityError;

export type QuantityValid = {
    valid: true;
    value: number;
};

type AddProductState = {
    reference: ReferenceValid | ReferenceInvalid;
    quantity: QuantityValid | QuantityInvalid;
};

const defaultState: AddProductState = {
    reference: {
        valid: false,
        error: 'EMPTY_REFERENCE',
    },
    quantity: {
        valid: true,
        value: 1,
    },
};

// ACTIONS

export interface DuplicateReferenceAction {
    type: 'DUPLICATE_REFERENCE_INPUT';
    reference: string;
}

export interface EmptyReferenceAction {
    type: 'EMPTY_REFERENCE_INPUT';
}

export interface ValidReferenceAction {
    type: 'VALID_REFERENCE_INPUT';
    reference: string;
}

export interface QuantityNotANumberAction {
    type: 'NAN_QUANTITY_INPUT';
}

export interface InvalidNumericalQuantityAction {
    type: 'INVALID_NUMERICAL_QUANTITY_INPUT';
    quantity: number;
}

export interface ValidQuantityAction {
    type: 'VALID_QUANTITY_INPUT';
    quantity: number;
}

export interface FormSubmittedAction {
    type: 'FORM_SUBMITTED';
}

export type AddProductActions =
    | DuplicateReferenceAction
    | EmptyReferenceAction
    | ValidReferenceAction
    | QuantityNotANumberAction
    | InvalidNumericalQuantityAction
    | ValidQuantityAction
    | FormSubmittedAction;

// UPDATE

export const addProductReducer: Reducer<AddProductState, AddProductActions> = (
    state: AddProductState = defaultState,
    action: AddProductActions,
): AddProductState => {
    switch (action.type) {
        case 'NAN_QUANTITY_INPUT':
            return {
                ...state,
                quantity: {
                    valid: false,
                    error: 'NOT_A_NUMBER',
                },
            };
        case 'INVALID_NUMERICAL_QUANTITY_INPUT':
            return {
                ...state,
                quantity: {
                    valid: false,
                    error: 'INVALID_NUMBER',
                    quantity: action.quantity,
                },
            };
        case 'DUPLICATE_REFERENCE_INPUT':
            return {
                ...state,
                reference: {
                    valid: false,
                    error: 'DUPLICATE_REFERENCE',
                    reference: action.reference,
                },
            };
        case 'EMPTY_REFERENCE_INPUT':
            return {
                ...state,
                reference: {
                    valid: false,
                    error: 'EMPTY_REFERENCE',
                },
            };
        case 'VALID_QUANTITY_INPUT':
            return {
                ...state,
                quantity: {
                    valid: true,
                    value: action.quantity,
                },
            };
        case 'VALID_REFERENCE_INPUT':
            return {
                ...state,
                reference: {
                    valid: true,
                    value: action.reference,
                },
            };
        case 'FORM_SUBMITTED':
            return defaultState;
        default:
            return state;
    }
};
