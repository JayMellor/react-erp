import { createStore, combineReducers, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { addProductReducer } from './add-product/Store';
import { productListReducer } from './product-list/Store';
import { addProductSaga } from './add-product/sagas';
import { productReducer } from './products/Store';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    productList: productListReducer,
    addProduct: addProductReducer,
    products: productReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(addProductSaga);
