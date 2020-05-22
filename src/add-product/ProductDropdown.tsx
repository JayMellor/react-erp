import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Store';
import { Dispatch } from 'redux';
import {
    DropdownState,
    ProductsState,
    DropdownActions,
    ProductActions,
} from './Store';
import { input } from '../styles/layout';
import { style } from 'typestyle';
import { onDropdownOpen } from './ActionCreators';
import { Product } from '../models';
import { alert } from '../styles/colors';
import { ChildProps } from '../types';

const DropdownBody = ({ children }: ChildProps): JSX.Element => (
    <div
        className={style({
            background: alert.toString(),
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
                        .map((product) => (
                            <div
                                key={product.reference}
                                tabIndex={0}
                                // onClick={selectItem(product)}
                                onMouseDown={selectItem(product)}
                                // onFocus={selectItem(product)}
                            >
                                {product.reference} {product.description}{' '}
                                {product.price}
                            </div>
                        ))}
                </DropdownBody>
            );
    }
};

const dropdownInput = (
    dropdownState: DropdownState,
    productsState: ProductsState,
    dispatch: Dispatch<DropdownActions | ProductActions>,
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

        onDropdownOpen(dispatch, productsState);
    };
    const getInputValue = (): string => {
        if (!dropdownState.open && dropdownState.itemSelected) {
            return dropdownState.item.reference;
        }

        return dropdownState.filter;
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
                    className={style(input)}
                    onFocus={onDropdownFocus}
                    onChange={filterUpdated}
                    value={getInputValue()}
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
    const products = useSelector(
        ({ addProduct }: RootState) => addProduct.products,
    );
    const dispatch = useDispatch();

    return dropdownInput(dropdown, products, dispatch);
};
