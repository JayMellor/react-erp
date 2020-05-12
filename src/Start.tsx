import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { style } from 'typestyle';
import {
    RemoveProductAction,
    REMOVE_PRODUCT,
    Product,
    ProductListActions,
    RootState,
} from './Store';
import { primaryLightest, primaryDarkest } from './colors';
import { Dispatch } from 'redux';
import { NewProduct } from './add-product/AddProduct';

const alert = style({
    background: primaryLightest.toString(),
    color: primaryDarkest.toString(),
    padding: 10,
    borderRadius: 5,
});

const productLineContainer = style({
    display: 'block',
});

// VIEW

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

const ProductList = (): JSX.Element => {
    const products = useSelector(
        ({ productList }: RootState) => productList.products,
    );
    const dispatch = useDispatch();
    return <ul>{products.map(productLine(dispatch))}</ul>;
    // {/* <h2>number of products: {products.length}</h2> */}
};

export const Start = (): JSX.Element => {
    return (
        <>
            <NewProduct></NewProduct>
            <ProductList></ProductList>
        </>
    );
};
