import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productReducer } from './products/Store';
import { addProductSaga } from './products/sagas';

const sagaMiddleware = createSagaMiddleware();

export const rootReducer = combineReducers({
    products: productReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(addProductSaga);
