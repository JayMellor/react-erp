// todo resurrect if using Thunk; otherwise delete
// import {
//     ProductsState, ProductActions,
// } from './Store';
// import { Dispatch } from 'redux';
// import { parseProductResponse } from '../models';
// import { fetchProducts } from '../api/product';

// export const onDropdownOpen = (
//     dispatch: Dispatch<ProductActions>,
//     productState: ProductsState,
// ): void => {
//     if (productState.state === 'LOADED') {
//         console.log('reusing!');
//         return;
//     }

//     dispatch({
//         type: 'PRODUCTS_LOADING',
//     });

//     fetchProducts().then(
//         (response) => {
//             if (!response.ok) {
//                 return dispatch({
//                     type: 'PRODUCTS_ERROR',
//                     error: response.statusText,
//                 });
//             }
//             return response.json().then((json) => {
//                 const parsed = parseProductResponse(json);
//                 if (parsed.success) {
//                     return dispatch({
//                         type: 'PRODUCTS_LOADED',
//                         products: parsed.response,
//                     });
//                 }
//                 return dispatch({
//                     type: 'PRODUCTS_ERROR',
//                     error: parsed.message,
//                 });
//             });
//         },
//         () => {
//             return dispatch({
//                 type: 'PRODUCTS_ERROR',
//                 error: 'Network application error',
//             });
//         },
//     );
// };
