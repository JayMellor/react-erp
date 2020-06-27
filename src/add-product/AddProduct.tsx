import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { Dispatch } from 'redux';
import { style, classes } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
    AddProductActions,
    QuantityValid,
    QuantityInvalid,
    FormSubmittedAction,
    useAddProductReducer,
} from './reducer';
import { Product, ProductLine, SubmitLine } from '../products/models';
import { sizing } from '../styles/sizes';
import {
    input,
    alertBorder,
    button,
    errorContainer,
    horizontalCenterBaseline,
    iconButton,
    solidBorder,
} from '../styles/layout';
import { alert, lightestGrey } from '../styles/colors';
import { ProductDropdown } from '../filter-dropdown/ProductDropdown';

// STYLES

const refInputLayout = {
    ...input,
    width: sizing.biggest,
    paddingLeft: sizing.smaller,
    marginRight: sizing.smallest,
};

const qtyInputLayout: NestedCSSProperties = {
    ...input,
    width: sizing.big,
    marginRight: sizing.smallest,
    textAlign: 'right',
    paddingRight: sizing.smaller,
};

const qtyInput = (
    validatedQuantity: QuantityValid | QuantityInvalid,
): string => {
    if (validatedQuantity.valid) {
        return style(qtyInputLayout);
    }
    return style(qtyInputLayout, {
        border: alertBorder,
    });
};

// VALIDATION

const referenceIsUnique = (
    newReference: string,
    products: ReadonlyArray<Product>,
): boolean => {
    const existingIndex = products.findIndex(
        ({ reference }) => reference === newReference,
    );
    if (existingIndex !== -1) {
        // Product already exists
        return false;
    }
    return true;
};

// SUBMISSION

const submitForm = (
    dispatch: React.Dispatch<FormSubmittedAction>,
    submitLine: SubmitLine,
    validatedQuantity: QuantityValid | QuantityInvalid,
    maybeProduct?: Product,
) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    if (!validatedQuantity.valid || !maybeProduct) {
        return;
    }

    const quantity = validatedQuantity.value;
    const selectedProduct = maybeProduct;
    submitLine({
        ...selectedProduct,
        quantity,
    });

    dispatch({
        type: 'FORM_SUBMITTED',
    });
};

const handleQuantityChange = (dispatch: React.Dispatch<AddProductActions>) => ({
    target,
}: React.ChangeEvent<HTMLInputElement>): void => {
    const newInput = target.value;
    const inputAsNumber = parseInt(newInput);

    if (inputAsNumber > 0) {
        dispatch({
            type: 'VALID_QUANTITY_INPUT',
            quantity: inputAsNumber,
        });
    } else if (inputAsNumber <= 0) {
        dispatch({
            type: 'INVALID_NUMERICAL_QUANTITY_INPUT',
            quantity: inputAsNumber,
        });
    } else {
        dispatch({
            type: 'NAN_QUANTITY_INPUT',
        });
    }
};

// VALUE MAPPING

const handleValidatedQuantity = (
    validatedQuantity: QuantityValid | QuantityInvalid,
): number | string => {
    if (validatedQuantity.valid) {
        return validatedQuantity.value;
    }

    switch (validatedQuantity.error) {
        case 'INVALID_NUMBER':
            return validatedQuantity.quantity;
        case 'NOT_A_NUMBER':
            return '';
    }
};

const displayQuantityError = (
    validatedQuantity: QuantityValid | QuantityInvalid,
): string => {
    if (validatedQuantity.valid) {
        return '';
    }

    switch (validatedQuantity.error) {
        case 'INVALID_NUMBER':
            return 'Please input a positive number';
        case 'NOT_A_NUMBER':
            return 'Please input a numerical quantity';
    }
};

// VIEW

interface NewProductProps {
    submitLine: SubmitLine;
}

export function NewProduct({ submitLine }: NewProductProps): JSX.Element {
    const [
        { quantity: validatedQuantity, maybeProduct, submitted },
        dispatch,
    ] = useAddProductReducer();
    const formChanged = useCallback(
        (item: Product): void => {
            dispatch({
                type: 'FORM_PRODUCT_CHANGED',
                product: item,
            });
        },
        [dispatch],
    );

    return (
        <form className={horizontalCenterBaseline}>
            <span
                className={style({
                    display: 'flex',
                    flexDirection: 'column',
                })}
            >
                <ProductDropdown
                    clearDropdown={submitted}
                    parentDispatch={formChanged}
                ></ProductDropdown>
                {/* <span
                    className={classes(
                        errorContainer,
                        style({
                            width: sizing.biggest,
                        }),
                    )}
                >
                    {displayReferenceError(validatedReference)}
                </span> */}
                {maybeProduct && (
                    <div
                        className={style({
                            fontSize: sizing.small,
                        })}
                    >
                        {maybeProduct.description}
                    </div>
                )}
            </span>
            <span
                className={style({
                    display: 'flex',
                    flexDirection: 'column',
                })}
            >
                <input
                    className={qtyInput(validatedQuantity)}
                    type="number"
                    onChange={handleQuantityChange(dispatch)}
                    value={handleValidatedQuantity(validatedQuantity)}
                ></input>
                <span
                    className={classes(
                        errorContainer,
                        style({
                            width: sizing.big,
                        }),
                    )}
                >
                    {displayQuantityError(validatedQuantity)}
                </span>
            </span>
            <button
                className={iconButton}
                type="submit"
                onClick={submitForm(
                    dispatch,
                    submitLine,
                    validatedQuantity,
                    maybeProduct,
                )}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
            {/* <div>
                {dropdownState.itemSelected && dropdownState.item.description}
            </div>
            <div>{dropdownState.itemSelected && dropdownState.item.price}</div> */}
            {/* <button
                className={classes(
                    iconButton,
                    style({
                        background: lightestGrey.toString(),
                        color: alert.toString(),
                        border: solidBorder(alert.toString())
                    }),
                )}
                type="submit"
                onClick={submitForm(
                    dispatch,
                    validatedQuantity,
                    validatedReference,
                )}
            >
                <FontAwesomeIcon
                    icon={faTimes}
                    className={style({
                        // marginRight: sizing.smallest, // todo className for marginRight: smallest?
                    })}
                />
            </button> */}
        </form>
    );
}
