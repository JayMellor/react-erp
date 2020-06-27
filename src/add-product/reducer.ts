import { Reducer, useReducer, Dispatch } from 'react';
import { Product } from '../products/models';

// MODEL

// type DuplicateReferenceError = {
//     error: 'DUPLICATE_REFERENCE';
//     reference: string;
// };

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
    quantity: QuantityValid | QuantityInvalid;
    maybeProduct?: Product;
    submitted: boolean;
};

const defaultState: AddProductState = {
    quantity: {
        valid: true,
        value: 1,
    },
    submitted: false,
};

// ACTIONS

// export interface DuplicateReferenceAction {
//     type: 'DUPLICATE_REFERENCE_INPUT';
//     reference: string;
// }

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

export interface ProductChanged {
    type: 'FORM_PRODUCT_CHANGED';
    product: Product;
}

export interface FormSubmittedAction {
    type: 'FORM_SUBMITTED';
}

export type AddProductActions =
    // | DuplicateReferenceAction
    | QuantityNotANumberAction
    | InvalidNumericalQuantityAction
    | ValidQuantityAction
    | ProductChanged
    | FormSubmittedAction;

// UPDATE

const addProductReducer: Reducer<AddProductState, AddProductActions> = (
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
        // case 'DUPLICATE_REFERENCE_INPUT':
        //     return {
        //         ...state,
        //         reference: {
        //             valid: false,
        //             error: 'DUPLICATE_REFERENCE',
        //             reference: action.reference,
        //         },
        //     };
        case 'VALID_QUANTITY_INPUT':
            return {
                ...state,
                quantity: {
                    valid: true,
                    value: action.quantity,
                },
                submitted: false,
            };
        case 'FORM_PRODUCT_CHANGED':
            return {
                ...state,
                maybeProduct: action.product,
                submitted: false,
            };
        case 'FORM_SUBMITTED':
            return { ...defaultState, submitted: true };
        default:
            return state;
    }
};

export const useAddProductReducer = (): [
    AddProductState,
    Dispatch<AddProductActions>,
] => {
    const [state, dispatch] = useReducer(addProductReducer, defaultState);
    return [state, dispatch];
};
