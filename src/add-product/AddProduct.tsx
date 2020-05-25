import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { Dispatch } from 'redux';
import { style, classes } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
    AddProductActions,
    QuantityValid,
    QuantityInvalid,
    ReferenceValid,
    ReferenceInvalid,
    FormSubmittedAction,
} from './Store';
import { Product } from '../products/models';
import { AddProductAction, ADD_PRODUCT } from '../product-list/Store';
import { RootState } from '../Store';
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
import { ProductDropdown } from './ProductDropdown';

// STYLES

const refInputLayout = {
    ...input,
    width: sizing.biggest,
    paddingLeft: sizing.smaller,
    marginRight: sizing.smallest,
};

const refInput = (
    validatedReference: ReferenceValid | ReferenceInvalid,
): string => {
    if (validatedReference.valid) {
        return style(refInputLayout);
    }
    return style(refInputLayout, {
        border: alertBorder,
    });
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
    dispatch: Dispatch<AddProductAction | FormSubmittedAction>,
    validatedQuantity: QuantityValid | QuantityInvalid,
    validatedReference: ReferenceValid | ReferenceInvalid,
) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    if (!validatedQuantity.valid || !validatedReference.valid) {
        return;
    }

    const quantity = validatedQuantity.value;
    const reference = validatedReference.value;
    dispatch({
        type: ADD_PRODUCT,
        payload: {
            quantity,
            price: 1,
            description: 'todo',
            reference,
        },
    });

    dispatch({
        type: 'FORM_SUBMITTED',
    });
};

const handleReferenceChange = (
    dispatch: Dispatch<AddProductActions>,
    products: ReadonlyArray<Product>,
) => ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    const newReference = target.value;

    if (referenceIsUnique(newReference, products) && newReference) {
        dispatch({
            type: 'VALID_REFERENCE_INPUT',
            reference: newReference,
        });
    } else if (newReference) {
        dispatch({
            type: 'DUPLICATE_REFERENCE_INPUT',
            reference: newReference,
        });
    } else {
        dispatch({
            type: 'EMPTY_REFERENCE_INPUT',
        });
    }
};

const handleQuantityChange = (dispatch: Dispatch<AddProductActions>) => ({
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

const handleValidatedReference = (
    validatedReference: ReferenceValid | ReferenceInvalid,
): string => {
    if (validatedReference.valid) {
        return validatedReference.value;
    }

    switch (validatedReference.error) {
        case 'DUPLICATE_REFERENCE':
            return validatedReference.reference;
        case 'EMPTY_REFERENCE':
            return '';
    }
};

const displayReferenceError = (
    validatedReference: ReferenceValid | ReferenceInvalid,
): string => {
    if (validatedReference.valid) {
        return '';
    }

    switch (validatedReference.error) {
        case 'DUPLICATE_REFERENCE':
            return 'This reference has already been added';
        case 'EMPTY_REFERENCE':
            // Empty warning to subtly inform the user
            return '';
    }
};

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

export const NewProduct = (): JSX.Element => {
    const products = useSelector(
        ({ productList }: RootState) => productList.products,
    );
    const validatedQuantity = useSelector(
        ({ addProduct }: RootState) => addProduct.quantity,
    );
    const validatedReference = useSelector(
        ({ addProduct }: RootState) => addProduct.reference,
    );
    const dispatch = useDispatch();

    return (
        <form className={horizontalCenterBaseline}>
            <span
                className={style({
                    display: 'flex',
                    flexDirection: 'column',
                })}
            >
                <ProductDropdown></ProductDropdown>
                <input
                    className={refInput(validatedReference)}
                    type="text"
                    onChange={handleReferenceChange(dispatch, products)}
                    placeholder="Product reference"
                    value={handleValidatedReference(validatedReference)}
                ></input>
                <span
                    className={classes(
                        errorContainer,
                        style({
                            width: sizing.biggest,
                        }),
                    )}
                >
                    {displayReferenceError(validatedReference)}
                </span>
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
                    validatedQuantity,
                    validatedReference,
                )}
            >
                <FontAwesomeIcon
                    icon={faPlus}
                    className={style({
                        // marginRight: sizing.smallest, // todo className for marginRight: smallest?
                    })}
                />
            </button>
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
};
