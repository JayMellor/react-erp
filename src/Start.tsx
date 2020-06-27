import React from 'react';
import { cssRule, cssRaw } from 'typestyle';
import { lightestGrey, lighterGrey } from './styles/colors';
import { sizing } from './styles/sizes';
import { solidBorder } from './styles/layout';
import { OrderBody } from './order-body/OrderBody';

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
    return <OrderBody></OrderBody>;
};
