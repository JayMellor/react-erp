import React, {
    ReactNode,
    useRef,
    useEffect,
    useState,
    useReducer,
    RefObject,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Store';
import { Dispatch } from 'react';
import { input, solidBorder, boxShadow } from '../styles/layout';
import { style } from 'typestyle';
import { Product } from '../products/models';
import {
    lightestGrey,
    lighterGrey,
    primaryLightest,
    primary,
} from '../styles/colors';
import { ChildProps, NavigationKey } from '../types';
import { ProductsState, ProductActions } from '../products/Store';
import { sizing } from '../styles/sizes';
import { hsla, borderColor, borderWidth, borderStyle } from 'csx';
import { padding, border } from 'csstips';
import {
    defaultState,
    DropdownActions,
    useDropdownReducer,
    DropdownState,
} from './Store';
import { AddProductAction } from '../product-list/Store';
import { AddProductActions } from '../add-product/Store';

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
    dispatch: Dispatch<DropdownActions<Product>>,
    productsState: ProductsState,
    dropdownState: DropdownState<Product>,
): JSX.Element => {
    const selectItem = (product: Product) => (): void => {
        dispatch({
            type: 'CLOSE_DROPDOWN_WITH_SELECTION',
            item: product,
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
            if (!dropdownState.items) {
                dispatch({
                    type: 'POPULATE_DROPDOWN_ITEMS',
                    items: productsState.products,
                });
            }
            return (
                <DropdownBody>
                    {dropdownState.filteredItems &&
                        dropdownState.filteredItems
                            .map<ReactNode>((product, idx) => (
                                <div
                                    key={idx}
                                    onClick={selectItem(product)}
                                    className={style(
                                        padding(sizing.normal, sizing.small),
                                        dropdownState.focus ===
                                            'DROPDOWN_ITEM' && // todo tidy
                                            dropdownState.itemIndex === idx && {
                                                // background: primary.toString(),
                                                // color: primaryLightest.toString(),
                                                borderLeftColor: borderColor(
                                                    primary.toString(),
                                                ),
                                                borderLeftWidth: borderWidth(
                                                    sizing.smallest,
                                                ),
                                                borderLeftStyle: 'solid',
                                            },
                                        {
                                            $nest: {
                                                '&:hover': {
                                                    background: primary.toString(),
                                                    color: primaryLightest.toString(),
                                                },
                                            },
                                        },
                                    )}
                                >
                                    {product.reference} {product.description}{' '}
                                    {product.price}
                                </div>
                            ))
                            .reduce(
                                (first, rest, idx) => [
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
                                        key={`border${idx}`}
                                    ></div>,
                                    rest,
                                ],
                                [],
                            )}
                </DropdownBody>
            );
    }
};

const useElementInFocus = (
    dispatch: Dispatch<DropdownActions<Product>>,
): RefObject<HTMLDivElement> => {
    const elementRef = useRef<HTMLDivElement>(null);
    const elementInFocus = (event: MouseEvent): void => {
        if (
            elementRef &&
            elementRef.current &&
            !elementRef.current.contains(event.target as Node)
        ) {
            dispatch({
                type: 'CLOSE_DROPDOWN_NO_SELECTION',
            });
        }
    };
    useEffect(() => {
        document.addEventListener('click', elementInFocus, true);
        return (): void => {
            document.removeEventListener('click', elementInFocus, true);
        };
    });
    return elementRef;
};

export interface ProductDropdownProps {
    parentDispatch: Dispatch<any>; // todo change to specific dispatch
    clearDropdown: boolean;
}

export function ProductDropdown({
    clearDropdown,
    parentDispatch,
}: ProductDropdownProps): JSX.Element {
    const products = useSelector(({ products }: RootState) => products);
    const productDispatch = useDispatch<Dispatch<ProductActions>>();

    const [state, dispatch] = useDropdownReducer<Product>(
        (filter) => (product): boolean =>
            filter === '' ||
            product.reference.includes(filter) ||
            product.description.includes(filter),
    );
    const elementRef = useElementInFocus(dispatch);
    useEffect(() => {
        if (clearDropdown) {
            dispatch({
                type: 'CLEAR_DROPDOWN_SELECTION',
            });
        }
    }, [clearDropdown, dispatch]);
    useEffect(() => {
        if (state.itemSelected) {
            parentDispatch({
                type: 'FORM_PRODUCT_CHANGED',
                product: state.item,
            });
        }
    }, [state, parentDispatch]);

    const onfilterUpdated = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch({
            type: 'UPDATE_DROPDOWN_FILTER',
            filter: target.value,
        });
    };
    const onDropdownFocus = (): void => {
        productDispatch({
            type: 'PRODUCTS_LOAD',
        });
        dispatch({
            type: 'OPEN_DROPDOWN',
            filter: '',
        });
    };
    const getInputValue = (): string => {
        if (state.open) {
            return state.filter;
        }
        if (state.itemSelected) {
            return state.item.reference;
        }
        return '';
    };
    const getPlaceholder = (): string => {
        if (state.itemSelected) {
            return state.item.reference;
        }
        return 'Product Reference';
    };
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        switch (event.key as NavigationKey) {
            case 'ArrowUp':
                dispatch({
                    type: 'DROPDOWN_NAVIGATE_UP',
                });
                return;
            case 'ArrowDown':
                dispatch({
                    type: 'DROPDOWN_NAVIGATE_DOWN',
                });
                return;
            case 'Escape':
                dispatch({
                    type: 'CLOSE_DROPDOWN_NO_SELECTION',
                });
                return;
            case 'Enter':
            case 'Tab':
                state.open && // needs tidying; needs specific types
                    state.focus === 'DROPDOWN_ITEM' &&
                    state.filteredItems &&
                    dispatch({
                        type: 'CLOSE_DROPDOWN_WITH_SELECTION',
                        item: state.filteredItems[state.itemIndex],
                    });
                return;
            default:
                // ignore
                return;
        }
    };
    return (
        <div ref={elementRef} onKeyDown={onKeyDown}>
            <input
                type="text"
                className={style(input, {
                    outline: 0,
                })}
                onFocus={onDropdownFocus}
                onChange={onfilterUpdated}
                value={getInputValue()}
                placeholder={getPlaceholder()}
            ></input>
            {dropdownList(dispatch, products, state)}
        </div>
    );
}
