import { SagaIterator } from 'redux-saga';
import { select, cancel, put, call, takeLatest } from 'redux-saga/effects';
import { RootState } from '../Store';
import { fetchProducts } from '../api/product';
import { parseProductResponse } from './models';

const productsLoaded = (state: RootState): boolean =>
    state.products.state === 'LOADED';

function* getProductsSaga(): SagaIterator {
    const loaded: boolean = yield select(productsLoaded);
    if (loaded) {
        yield cancel();
    }

    yield put({
        type: 'PRODUCTS_LOADING',
    });
    try {
        const response: Response = yield call(fetchProducts);
        if (!response.ok) {
            const error: string = yield call(() => response.text());
            throw new Error(error);
        }
        const json: unknown = yield call(() => response.json());
        const parsed = parseProductResponse(json);
        if (!parsed.success) {
            throw new Error(parsed.message);
        }
        yield put({
            type: 'PRODUCTS_LOADED',
            products: parsed.response,
        });
    } catch (error) {
        yield put({
            type: 'PRODUCTS_ERROR',
            error: error.message,
        });
    }
}

export function* addProductSaga(): SagaIterator {
    yield takeLatest('PRODUCTS_LOAD', getProductsSaga);
}