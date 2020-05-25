import { Reducer } from 'redux';
import { ProductLine } from '../products/models';

export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';

// ACTIONS

export interface AddProductAction {
    type: typeof ADD_PRODUCT;
    payload: ProductLine;
}

export interface EditProductAction {
    type: 'EDIT_PRODUCT',
}

export interface RemoveProductAction {
    type: typeof REMOVE_PRODUCT;
    payload: string;
}

export type ProductListActions = AddProductAction | RemoveProductAction;

// STATE

export interface ProductListState {
    products: ReadonlyArray<ProductLine>;
}

const defaultState: ProductListState = {
    products: [],
};

// REDUCER

export const productListReducer: Reducer<ProductListState, ProductListActions> = (
    state: ProductListState = defaultState,
    action: ProductListActions,
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
            return state;
    }
};