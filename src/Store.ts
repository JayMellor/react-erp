import { createStore, Reducer } from 'redux';

export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';

// ACTIONS

export interface AddProductAction {
    type: typeof ADD_PRODUCT;
    payload: Product;
}

export interface RemoveProductAction {
    type: typeof REMOVE_PRODUCT;
    payload: string;
}

export type ProductActions = AddProductAction | RemoveProductAction;

// STATE

export interface Product {
    reference: string;
    quantity: number;
}

export interface ProductListState {
    products: ReadonlyArray<Product>;
}

const defaultState: ProductListState = {
    products: [],
};

// REDUCER

const rootReducer: Reducer<ProductListState, ProductActions> = (
    state: ProductListState = defaultState,
    action: ProductActions,
): ProductListState => {
    switch (action.type) {
        case ADD_PRODUCT:
            return { products: [...state.products, action.payload] };
        case REMOVE_PRODUCT:
            return {
                products: state.products.filter(
                    (product) => product.reference !== action.payload,
                ),
            };
        default:
            return defaultState;
    }
};

export const store = createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);
