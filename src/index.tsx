import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Start } from './Start';
import { store } from './Store';

ReactDOM.render(
    <Provider store={store}>
        <Start />
    </Provider>,
    document.getElementById('root'),
);
