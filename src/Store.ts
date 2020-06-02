import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducer } from './product-list/Store';
import { productReducer } from './products/Store';
import { addProductSaga } from './products/sagas';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    productList: productListReducer,
    products: productReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(addProductSaga);
