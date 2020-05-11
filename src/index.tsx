import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Start } from './Start';
import { store } from './Store';
import { cssRaw, style, cssRule, fontFace } from 'typestyle';

// cssRaw(`
// @import url('https://fonts.googleapis.com/css?family=Roboto');
// `);

// cssRule('html, body', {
//     fontFamily: 'Roboto, sans-serif',
// });

// const rr = style({fontFamily:'Roboto, sans-serif'});

// fontFace({
//     fontFamily: 'Roboto',
//     fontStyle: 'normal',
//     fontWeight: 400,
//     src: 'https://fonts.googleapis.com/css?family=Roboto',
//     unicodeRange: 'U+0460-052F, U+20B4, U+2DE0-2DFF, U+A640-A69F'
//   });

ReactDOM.render(
    <Provider store={store}>
        <Start />
    </Provider>,
    document.getElementById('root'),
);
