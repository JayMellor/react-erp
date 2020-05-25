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
import { ProductLine } from '../products/models';
import { sizing } from '../styles/sizes';
import {
    primaryLightest,
    primaryDarkest,
    alertLightest,
    alertDarkest,
    lighterGrey,
} from '../styles/colors';
import { solidBorder } from '../styles/layout';

const lineContainer = style(
    {
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        width: sizing.huger,
    },
    csstips.horizontallySpaced(8),
    csstips.horizontal,
);

const quantityContainer = style({
    textAlign: 'right',
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
    product: ProductLine,
): JSX.Element => (
    <div className={lineContainer} key={product.reference}>
        <div
            className={style({
                fontSize: sizing.mediumBig,
            })}
        >
            {product.reference}
        </div>
        <div
            className={classes(
                quantityContainer,
                style({
                    fontSize: sizing.mediumBig,
                }),
            )}
        >
            {product.quantity}
        </div>
        {/* <button
            className={removeButton}
            onClick={(): RemoveProductAction =>
                dispatch({
                    type: REMOVE_PRODUCT,
                    payload: product.reference,
                })
            }
        >
            Remove Product
        </button> */}
    </div>
);

export const ProductList = (): JSX.Element => {
    const products = useSelector(
        ({ productList }: RootState) => productList.products,
    );
    const dispatch = useDispatch();
    if (products.length > 0) {
        return (
            <div
                className={style({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                })}
            >
                {products
                    .map<React.ReactNode>(productLine(dispatch))
                    .reduce((first, rest, idx) => [
                        first,
                        <div
                            className={style({
                                borderTop: solidBorder(lighterGrey.toString()),
                                margin: sizing.smaller,
                                width: sizing.bigger,
                                height: sizing.borderWidth,
                            })}
                            key={idx}
                        ></div>,
                        rest,
                    ])}
            </div>
        );
    }
    return (
        <>
            <div
                className={classes(
                    lineContainer,
                    alert,
                    style({
                        marginTop: 24,
                    }),
                )}
            >
                Add a product to the order
            </div>
            <div className={classes(lineContainer, primary)}>
                Add a product to the order
            </div>
        </>
    );
};
