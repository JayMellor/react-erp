import React, { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Store';
import { Dispatch } from 'redux';
import { DropdownState, DropdownActions } from './Store';
import { input, solidBorder, boxShadow } from '../styles/layout';
import { style } from 'typestyle';
import { Product } from '../products/models';
import { lightestGrey, lighterGrey } from '../styles/colors';
import { ChildProps } from '../types';
import { ProductsState } from '../products/Store';
import * as csstips from 'csstips';
import { sizing } from '../styles/sizes';
import { hsla } from 'csx';

const DropdownBody = ({ children }: ChildProps): JSX.Element => (
    <div
        className={style({
            background: lightestGrey.toString(),
            position: 'absolute',
            boxShadow: boxShadow(0, 4, 10, hsla(0, 0, 0, 0.1).toString()),
        })}
    >
        {children}
    </div>
);

const dropdownList = (
    dispatch: Dispatch<DropdownActions>,
    dropdownState: DropdownState,
    productsState: ProductsState,
): JSX.Element => {
    const filterItems = (filter: string) => ({
        reference,
    }: Product): boolean => {
        if (filter === '') {
            return true;
        }
        if (reference.includes(filter)) {
            return true;
        }
        return false;
    };
    const selectItem = (product: Product) => (): void => {
        console.log('child mousedown');
        dispatch({
            type: 'CLOSE_DROPDOWN_WITH_SELECTION',
            product,
        });
    };

    if (!dropdownState.open) {
        return <></>;
    }

    switch (productsState.state) {
        case 'EMPTY':
            return <></>;
        case 'LOADING':
            return <DropdownBody>loading</DropdownBody>;
        case 'ERROR':
            return <DropdownBody>{productsState.error}</DropdownBody>;
        case 'LOADED':
            return (
                <DropdownBody>
                    {productsState.products
                        .filter(filterItems(dropdownState.filter))
                        .map<ReactNode>((product) => (
                            <div
                                key={product.reference}
                                tabIndex={0}
                                // onClick={selectItem(product)}
                                onMouseDown={selectItem(product)}
                                // onFocus={selectItem(product)}
                                className={style(
                                    csstips.padding(
                                        sizing.normal,
                                        sizing.small,
                                    ),
                                )}
                            >
                                {product.reference} {product.description}{' '}
                                {product.price}
                            </div>
                        ))
                        .reduce((first, rest, idx) => [
                            first,
                            <div
                                className={style({
                                    borderTop: solidBorder(
                                        lighterGrey.toString(),
                                    ),
                                    // margin: sizing.smaller,
                                    // width: sizing.bigger,
                                    height: sizing.borderWidth,
                                })}
                                key={idx}
                            ></div>,
                            rest,
                        ])}
                </DropdownBody>
            );
    }
};

const dropdownInput = (
    dropdownState: DropdownState,
    productsState: ProductsState,
    dispatch: Dispatch<DropdownActions>,
): JSX.Element => {
    const filterUpdated = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>): void => {
        const newFilter = target.value;

        dispatch({
            type: 'UPDATE_DROPDOWN_FILTER',
            filter: newFilter,
        });
    };
    const onDropdownFocus = (): void => {
        if (dropdownState.open) {
            return;
        }

        dispatch({
            type: 'OPEN_DROPDOWN',
            filter: dropdownState.filter,
        });
    };
    const getInputValue = (): string => {
        if (!dropdownState.open && dropdownState.itemSelected) {
            return dropdownState.item.reference;
        }

        return dropdownState.filter;
    };
    const getPlaceholder = (): string => {
        if (dropdownState.itemSelected) {
            return dropdownState.item.reference;
        }
        return '';
    };
    const closeDropdown = (): void => {
        console.log('blur');
        dispatch({
            type: 'CLOSE_DROPDOWN_NO_SELECTION',
        });
    };
    return (
        <div onBlur={closeDropdown} onFocus={() => console.log('focus')}>
            <div>
                <input
                    type="text"
                    className={style(input, {
                        outline: 0,
                    })}
                    onFocus={onDropdownFocus}
                    onChange={filterUpdated}
                    value={getInputValue()}
                    placeholder={getPlaceholder()}
                ></input>
                {dropdownList(dispatch, dropdownState, productsState)}
            </div>
        </div>
    );
};

export const ProductDropdown = (): JSX.Element => {
    const dropdown = useSelector(
        ({ addProduct }: RootState) => addProduct.dropdown,
    );
    const products = useSelector(({ products }: RootState) => products);
    const dispatch = useDispatch<Dispatch<DropdownActions>>();

    return dropdownInput(dropdown, products, dispatch);
};
