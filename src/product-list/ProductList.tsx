import React from 'react';
import { style, classes } from 'typestyle';
import { ProductLine, productLinePrice } from '../products/models';
import { sizing } from '../styles/sizes';
import {
    primaryLightest,
    primaryDarkest,
    alertLightest,
    alertDarkest,
    lighterGrey,
} from '../styles/colors';
import { solidBorder } from '../styles/layout';

const lineContainer = style({
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    width: sizing.huger,
});

const quantityContainer = style({
    textAlign: 'right',
    // marginLeft: sizing.small,
});

const removeButton = style({
    // marginLeft: sizing.bigger,
});

const divider = (
    <div
        className={style({
            borderTop: solidBorder(lighterGrey.toString()),
            marginTop: sizing.smaller,
            marginBottom: sizing.smaller,
            width: sizing.huger,
            height: sizing.borderWidth,
        })}
    ></div>
);

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

const productLine = () => (product: ProductLine): JSX.Element => (
    <div key={product.reference}>
        <div className={lineContainer}>
            <div
                className={style({
                    fontSize: sizing.normal,
                })}
            >
                {product.reference}
            </div>
            @
            <div
                className={style({
                    fontSize: sizing.normal,
                })}
            >
                <span
                    className={style({
                        fontSize: sizing.small,
                    })}
                >
                    £
                </span>
                {product.price.toFixed(2)}
            </div>
            <div
                className={classes(
                    quantityContainer,
                    style({
                        fontSize: sizing.normal,
                        color: primaryDarkest.toString(),
                    }),
                )}
            >
                <span
                    className={style({
                        fontSize: sizing.small,
                    })}
                >
                    x
                </span>
                {product.quantity}
            </div>
            =
            <div>
                <span
                    className={style({
                        fontSize: sizing.small,
                    })}
                >
                    £
                </span>
                {productLinePrice(product).toFixed(2)}
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
        <div
            className={style({
                fontSize: sizing.small,
                marginTop: sizing.smallest,
            })}
        >
            {product.description}
        </div>
        {divider}
    </div>
);

interface ProductListProps {
    products: ReadonlyArray<ProductLine>;
}

export function ProductList({ products }: ProductListProps): JSX.Element {
    if (products.length > 0) {
        return (
            <div
                className={style({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                })}
            >
                {divider}
                {products.map<React.ReactNode>(productLine())}
                <div
                    className={style({
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        width: sizing.huger,
                    })}
                >
                    Total
                    <span>
                        <span
                            className={style({
                                fontSize: sizing.small,
                            })}
                        >
                            £
                        </span>
                        {products
                            .reduce(
                                (runningTotal, product) =>
                                    runningTotal + productLinePrice(product),
                                0,
                            )
                            .toFixed(2)}
                    </span>
                </div>
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
}
