import { Reducer } from 'redux';
import { Product } from '../models';

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

type DropdownFocus =
    | {
          focus: 'NO_FOCUS';
      }
    | {
          focus: 'DROPDOWN_INPUT';
      }
    | {
          focus: 'DROPDOWN_ITEM';
          item: number; // todo
      };

type ItemSelected =
    | {
          itemSelected: true;
          item: Product;
      }
    | {
          itemSelected: false;
      };

export type DropdownState = {
    open: boolean;
    filter: string;
} & ItemSelected;
// DropdownFocus;

type ProductsEmpty = {
    state: 'EMPTY';
};

type ProductsError = {
    state: 'ERROR';
    error: string;
};

type ProductLoading = {
    state: 'LOADING';
};

type ProductsLoaded = {
    state: 'LOADED';
    products: Product[];
};

export type ProductsState =
    | ProductsEmpty
    | ProductLoading
    | ProductsError
    | ProductsLoaded;

type AddProductState = {
    reference: ReferenceValid | ReferenceInvalid;
    quantity: QuantityValid | QuantityInvalid;
    dropdown: DropdownState;
    products: ProductsState;
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
    dropdown: {
        open: false,
        filter: '',
        itemSelected: false,
        // focus: 'NO_FOCUS',
    },
    products: {
        state: 'EMPTY',
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

interface LoadingProducts {
    type: 'PRODUCTS_LOADING';
}

interface LoadedProducts {
    type: 'PRODUCTS_LOADED';
    products: Product[];
}

interface ErrorProducts {
    type: 'PRODUCTS_ERROR';
    error: string;
}

export type ProductActions = LoadingProducts | LoadedProducts | ErrorProducts;

interface OpenDropdown {
    type: 'OPEN_DROPDOWN';
    filter: string;
}

interface UpdateDropdownFilter {
    type: 'UPDATE_DROPDOWN_FILTER';
    filter: string;
}

interface CloseDropdownWithSelection {
    type: 'CLOSE_DROPDOWN_WITH_SELECTION';
    product: Product;
}

interface CloseDropdownNoSelection {
    type: 'CLOSE_DROPDOWN_NO_SELECTION';
}

export type DropdownActions =
    | OpenDropdown
    | CloseDropdownNoSelection
    | UpdateDropdownFilter
    | CloseDropdownWithSelection;

export type AddProductActions =
    | DuplicateReferenceAction
    | EmptyReferenceAction
    | ValidReferenceAction
    | QuantityNotANumberAction
    | InvalidNumericalQuantityAction
    | ValidQuantityAction
    | FormSubmittedAction
    | DropdownActions
    | ProductActions;

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
        case 'OPEN_DROPDOWN':
            return {
                ...state,
                dropdown: {
                    ...state.dropdown,
                    open: true,
                    filter: action.filter,
                },
            };
        case 'PRODUCTS_LOADING':
            return {
                ...state,
                products: {
                    state: 'LOADING',
                },
            };
        case 'PRODUCTS_LOADED':
            return {
                ...state,
                products: {
                    state: 'LOADED',
                    products: action.products,
                },
            };
        case 'PRODUCTS_ERROR':
            return {
                ...state,
                products: {
                    state: 'ERROR',
                    error: action.error,
                },
            };
        case 'UPDATE_DROPDOWN_FILTER':
            return {
                ...state,
                dropdown: {
                    ...state.dropdown,
                    filter: action.filter,
                },
            };
        case 'CLOSE_DROPDOWN_NO_SELECTION':
            return {
                ...state,
                dropdown: {
                    ...state.dropdown,
                    open: false,
                },
            };
        case 'CLOSE_DROPDOWN_WITH_SELECTION':
            return {
                ...state,
                dropdown: {
                    open: false,
                    filter: '',
                    itemSelected: true,
                    item: action.product,
                },
            };
        default:
            return state;
    }
};
