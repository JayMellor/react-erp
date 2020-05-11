import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { style } from 'typestyle';
import {
    ProductListState,
    ADD_PRODUCT,
    AddProductAction,
    RemoveProductAction,
    REMOVE_PRODUCT,
    Product,
    ProductActions,
} from './Store';
import { primary, primaryLightest, primaryDarkest, buttonText } from './colors';
import { Dispatch } from 'redux';

const button = style({
    background: primary.toString(),
    color: buttonText.toString(),
    padding: 5,
    borderRadius: 4,
});

const alert = style({
    background: primaryLightest.toString(),
    color: primaryDarkest.toString(),
    padding: 10,
    borderRadius: 5,
});

const productLineContainer = style({
    display: 'block',
});

const defaultQuantity = 1;

// VIEW

const productLine = (dispatch: Dispatch<ProductActions>) => (
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
    const products = useSelector(({ products }: ProductListState) => products);
    const dispatch = useDispatch();
    return <ul>{products.map(productLine(dispatch))}</ul>;
    // {/* <h2>number of products: {products.length}</h2> */}
};

const NewProduct = (): JSX.Element => {
    const [reference, setReference] = useState('');
    const [quantity, setQuantity] = useState(defaultQuantity);
    const dispatch = useDispatch();

    return (
        <div>
            <input
                type="text"
                onChange={(event): void => setReference(event.target.value)}
                placeholder="Product reference"
            ></input>
            <input
                type="number"
                onChange={(event): void =>
                    setQuantity(parseInt(event.target.value))
                }
                defaultValue={defaultQuantity}
            ></input>
            <button
                className={button}
                type="submit"
                onClick={(): AddProductAction =>
                    dispatch({
                        type: ADD_PRODUCT,
                        payload: {
                            quantity,
                            reference,
                        },
                    })
                }
            >
                Add Product
            </button>
        </div>
    );
};

export const Start = (): JSX.Element => {
    return (
        <>
            <NewProduct></NewProduct>
            <ProductList></ProductList>
        </>
    );
};
