import { Dispatch } from 'redux';
import React from 'react';
import { style, classes } from 'typestyle';
import { useSelector, useDispatch } from 'react-redux';
import * as csstips from 'csstips';
import {
    ProductListActions,
    RemoveProductAction,
    REMOVE_PRODUCT,
} from './Store';
import { RootState } from '../Store';
import { Product } from '../models';
import { sizing } from '../styles/sizes';
import {
    primaryLightest,
    primaryDarkest,
    alertLightest,
    alertDarkest,
} from '../styles/colors';

const lineContainer = style(
    {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
    },
    csstips.horizontallySpaced(8),
    csstips.horizontal,
);

const quantityContainer = style({
    // marginLeft: sizing.small,
});

const removeButton = style({
    // marginLeft: sizing.bigger,
});

const alert = style({
    background: alertLightest.toString(),
    color: alertDarkest.toString(),
    paddingTop: sizing.small,
    paddingBottom: sizing.small,
    paddingLeft: sizing.normal,
    paddingRight: sizing.normal,
    borderRadius: sizing.smallest,
});

const primary = style({
    background: primaryLightest.toString(),
    color: primaryDarkest.toString(),
    paddingTop: sizing.small,
    paddingBottom: sizing.small,
    paddingLeft: sizing.normal,
    paddingRight: sizing.normal,
    borderRadius: sizing.smallest,
});

const productLine = (dispatch: Dispatch<ProductListActions>) => (
    product: Product,
): JSX.Element => (
    <div className={lineContainer} key={product.reference}>
        <div>{product.reference}</div>
        <div className={quantityContainer}>x{product.quantity}</div>
        <button
            className={removeButton}
            onClick={(): RemoveProductAction =>
                dispatch({
                    type: REMOVE_PRODUCT,
                    payload: product.reference,
                })
            }
        >
            Remove Product
        </button>
    </div>
);

export const ProductList = (): JSX.Element => {
    const products = useSelector(
        ({ productList }: RootState) => productList.products,
    );
    const dispatch = useDispatch();
    if (products.length > 0) {
        return <div>{products.map(productLine(dispatch))}</div>;
    } else {
        return (
            <>
                <div className={classes(lineContainer, alert)}>
                    Add a product to the order
                </div>
                <div className={classes(lineContainer, primary)}>
                    Add a product to the order
                </div>
            </>
        );
    }
};
