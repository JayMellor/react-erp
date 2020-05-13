import React from 'react';
import { style } from 'typestyle';
import { primaryLightest, primaryDarkest } from './colors';
import { NewProduct } from './add-product/AddProduct';
import { ProductList } from './product-list/ProductList';

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

export const Start = (): JSX.Element => {
    return (
        <>
            <NewProduct></NewProduct>
            <ProductList></ProductList>
        </>
    );
};
