import React, {
    ReactNode,
    useRef,
    useEffect,
    RefObject,
    Dispatch,
} from 'react';
import { style } from 'typestyle';
import { hsla, borderColor, borderWidth } from 'csx';
import { padding } from 'csstips';
import { input, solidBorder, boxShadow } from '../styles/layout';
import {
    lightestGrey,
    lighterGrey,
    primaryLightest,
    primary,
} from '../styles/colors';
import { ChildProps, NavigationKey, TypingKey } from '../types';
import { sizing } from '../styles/sizes';
import {
    DropdownActions,
    useDropdownReducer,
    DropdownState,
    itemIsFocused,
} from './reducer';
import { itemSet } from './types';

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

function dropdownList<ItemType>(
    dispatch: Dispatch<DropdownActions<ItemType>>,
    state: DropdownState<ItemType>,
    renderItem: (item: ItemType) => ReactNode,
    loadItems: (dispatch: Dispatch<DropdownActions<ItemType>>) => void,
    getItemRef: (item: ItemType) => string,
): JSX.Element {
    const selectItem = (item: ItemType) => (): void => {
        dispatch({
            type: 'DROPDOWN_ITEM_SELECTED',
            item,
        });
    };

    if (!state.open) {
        return <></>;
    }

    if (!state.itemsLoaded) {
        loadItems(dispatch);
        return <DropdownBody>loading</DropdownBody>;
    }

    return (
        <DropdownBody>
            {state.filteredItems
                .map<ReactNode>((item, idx) => (
                    <div
                        key={getItemRef(item)}
                        onClick={selectItem(item)}
                        className={style(
                            padding(sizing.normal, sizing.small),
                            itemIsFocused(state.dropdownFocus, idx) && {
                                // background: primary.toString(),
                                // color: primaryLightest.toString(),
                                borderLeftColor: borderColor(
                                    primary.toString(),
                                ),
                                borderLeftWidth: borderWidth(sizing.smallest),
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
                        {renderItem(item)}
                    </div>
                ))
                .reduce(
                    (first, rest, idx) => [
                        first,
                        <div
                            className={style({
                                borderTop: solidBorder(lighterGrey.toString()),
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

function useElementInFocus<ItemType>(
    dispatch: Dispatch<DropdownActions<ItemType>>,
): RefObject<HTMLDivElement> {
    const elementRef = useRef<HTMLDivElement>(null);
    const elementInFocus = (event: MouseEvent): void => {
        if (
            elementRef &&
            elementRef.current &&
            !elementRef.current.contains(event.target as Node)
        ) {
            dispatch({
                type: 'DROPDOWN_EXITED',
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
}

export interface FilterDropdownProps<ItemType> {
    parentDispatch: itemSet<ItemType>;
    clearDropdown: boolean;
    renderItem: (item: ItemType) => ReactNode;
    filterItem: (filter: string) => (item: ItemType) => boolean;
    getItemRef: (item: ItemType) => string;
    loadItems: (dispatch: Dispatch<DropdownActions<ItemType>>) => void;
    placeholder: string;
    getItems?: () => void;
}

export function FilterDropdown<ItemType>({
    clearDropdown,
    parentDispatch,
    renderItem,
    filterItem,
    getItemRef,
    loadItems,
    placeholder,
    getItems,
}: FilterDropdownProps<ItemType>): JSX.Element {
    const [state, dispatch] = useDropdownReducer<ItemType>(filterItem);
    const elementRef = useElementInFocus(dispatch);
    useEffect(() => {
        if (clearDropdown) {
            dispatch({
                type: 'DROPDOWN_ITEM_DISCARDED',
            });
        }
    }, [clearDropdown, dispatch]);
    useEffect(() => {
        if (state.itemsLoaded && state.itemSelected) {
            parentDispatch(state.item);
        }
    }, [state, parentDispatch]);

    const onfilterUpdated = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch({
            type: 'DROPDOWN_FILTER_UPDATED',
            filter: target.value,
        });
    };
    const onDropdownFocus = (): void => {
        getItems && getItems();
        dispatch({
            type: 'DROPDOWN_SELECTED',
        });
    };
    const getInputValue = (): string => {
        if (!state.itemsLoaded) {
            return '';
        }
        if (state.open) {
            return state.filter;
        }
        if (state.itemSelected) {
            return getItemRef(state.item);
        }
        return '';
    };
    const getPlaceholder = (): string => {
        if (state.itemsLoaded && state.itemSelected) {
            return getItemRef(state.item);
        }
        return placeholder;
    };
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!state.itemsLoaded) {
            return;
        }

        if (!state.open) {
            switch (event.key as TypingKey | NavigationKey) {
                case 'ArrowDown':
                case 'ArrowUp':
                case 'Backspace':
                case 'Delete':
                case ' ':
                    dispatch({
                        type: 'DROPDOWN_SELECTED',
                    });
                    return;
                case 'ArrowLeft':
                case 'ArrowRight':
                    event.preventDefault();
                    return;
                default:
                    // ignore
                    return;
            }
        }

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
                    type: 'DROPDOWN_EXITED',
                });
                return;
            case 'Enter':
                event.preventDefault();
            // eslint-disable-next-line no-fallthrough
            case 'Tab':
                if (state.dropdownFocus.focus === 'DROPDOWN_ITEM') {
                    dispatch({
                        type: 'DROPDOWN_ITEM_SELECTED',
                        item:
                            state.filteredItems[state.dropdownFocus.itemIndex],
                    });
                }
                return;
            default:
                // ignore
                return;
        }
    };
    return (
        <div ref={elementRef}>
            <input
                type="text"
                className={style(input, {
                    outline: sizing.none,
                    paddingLeft: sizing.small,
                })}
                onFocus={onDropdownFocus}
                onKeyDown={onKeyDown}
                onChange={onfilterUpdated}
                value={getInputValue()}
                placeholder={getPlaceholder()}
                autoFocus
            ></input>
            {dropdownList<ItemType>(
                dispatch,
                state,
                renderItem,
                loadItems,
                getItemRef,
            )}
        </div>
    );
}
