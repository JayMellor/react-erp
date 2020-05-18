import React from 'react';
import { cssRule, cssRaw } from 'typestyle';
import { lightestGrey, lighterGrey } from './styles/colors';
import { NewProduct } from './add-product/AddProduct';
import { ProductList } from './product-list/ProductList';
import { sizing } from './styles/sizes';
import { border } from 'csx';

cssRaw(`
@import url('https://fonts.googleapis.com/css?family=Roboto|Lato');
`);

cssRule('body', {
    fontFamily: 'Roboto, sans-serif',
    background: lightestGrey.toString(),
    margin: sizing.none,
});

cssRule('input', {
    fontFamily: 'Lato, sans-serif',
    border: border({
        color: lighterGrey.toString(),
        style: 'solid',
        width: sizing.borderWidth,
    }),
});

// VIEW

export const Start = (): JSX.Element => {
    return (
        <div>
            <NewProduct></NewProduct>
            <ProductList></ProductList>
        </div>
    );
};
