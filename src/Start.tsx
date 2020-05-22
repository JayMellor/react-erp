import React from 'react';
import { cssRule, cssRaw, style } from 'typestyle';
import { lightestGrey, lighterGrey } from './styles/colors';
import { NewProduct } from './add-product/AddProduct';
import { ProductList } from './product-list/ProductList';
import { sizing } from './styles/sizes';
import { solidBorder } from './styles/layout';
import * as csstips from 'csstips';

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
    border: solidBorder(lighterGrey.toString()),
});

// VIEW

export const Start = (): JSX.Element => {
    return (
        <div
            className={style(
                csstips.vertical,
                csstips.verticallySpaced(sizing.normal),
            )}
        >
            <NewProduct></NewProduct>
            <ProductList></ProductList>
        </div>
    );
};
