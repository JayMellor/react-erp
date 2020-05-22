import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { addProductReducer } from './add-product/Store';
import { productListReducer } from './product-list/Store';

const rootReducer = combineReducers({
    productList: productListReducer,
    addProduct: addProductReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk)),
);
