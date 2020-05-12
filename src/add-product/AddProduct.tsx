import { useSelector, useDispatch } from 'react-redux';
import { AddProductAction, ADD_PRODUCT, RootState, Product } from '../Store';
import React from 'react';
import { Dispatch } from 'redux';
import { style } from 'typestyle';
import { primary, buttonText } from '../colors';
import {
    AddProductActions,
    QuantityValid,
    QuantityInvalid,
    ReferenceValid,
    ReferenceInvalid,
    FormSubmittedAction,
} from './Store';

// todo - move to more central location
const button = style({
    background: primary.toString(),
    color: buttonText.toString(),
    padding: 5,
    borderRadius: 4,
});

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
            reference,
        },
    });

    dispatch({
        type: 'FORM_SUBMITTED',
    });
};

const showReferenceError = (isValid: boolean): JSX.Element => {
    if (!isValid) {
        return <div>Sommaty here</div>;
    }
    return <></>;
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
        <form>
            <input
                type="text"
                onChange={handleReferenceChange(dispatch, products)}
                placeholder="Product reference"
                value={handleValidatedReference(validatedReference)}
            ></input>
            <input
                type="number"
                onChange={handleQuantityChange(dispatch)}
                value={handleValidatedQuantity(validatedQuantity)}
            ></input>
            <button
                className={button}
                type="submit"
                onClick={submitForm(
                    dispatch,
                    validatedQuantity,
                    validatedReference,
                )}
            >
                Add Product
            </button>
        </form>
    );
};
