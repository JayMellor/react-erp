import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import { getProductsSaga } from '../products/sagas';

export function* addProductSaga(): SagaIterator {
    yield takeLatest('OPEN_DROPDOWN', getProductsSaga);
}
