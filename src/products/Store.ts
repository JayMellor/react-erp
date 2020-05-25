import { Product } from './models';
import { Reducer } from 'redux';

// MODEL

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

const defaultState: ProductsState = {
    state: 'EMPTY',
};

// ACTIONS

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

// REDUCER

export const productReducer: Reducer<ProductsState, ProductActions> = (
    state = defaultState,
    action,
) => {
    switch (action.type) {
        case 'PRODUCTS_LOADING':
            return {
                state: 'LOADING',
            };
        case 'PRODUCTS_LOADED':
            return {
                state: 'LOADED',
                products: action.products,
            };
        case 'PRODUCTS_ERROR':
            return {
                state: 'ERROR',
                error: action.error,
            };
        default:
            return state;
    }
};
