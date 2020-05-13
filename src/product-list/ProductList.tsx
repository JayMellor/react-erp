import { Dispatch } from 'redux';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProductListActions, RemoveProductAction, REMOVE_PRODUCT } from './Store';
import { RootState } from '../Store';
import { Product } from '../models';


const productLine = (dispatch: Dispatch<ProductListActions>) => (
    product: Product,
): JSX.Element => (
    <li key={product.reference}>
        <button
            onClick={(): RemoveProductAction =>
                dispatch({
                    type: REMOVE_PRODUCT,
                    payload: product.reference,
                })
            }
        >
            Remove Product
        </button>
        <div>
            {product.reference}, {product.quantity}
        </div>
    </li>
);

export const ProductList = (): JSX.Element => {
    const products = useSelector(
        ({ productList }: RootState) => productList.products,
    );
    const dispatch = useDispatch();
    return <ul>{products.map(productLine(dispatch))}</ul>;
    // {/* <h2>number of products: {products.length}</h2> */}
};