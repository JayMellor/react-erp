import { Reducer, useReducer, Dispatch } from 'react';

// MODEL

type DropdownFocus =
    | {
          focus: 'DROPDOWN_INPUT';
      }
    | {
          focus: 'DROPDOWN_ITEM';
          itemIndex: number;
      };

export const itemIsFocused = (
    dropdownFocus: DropdownFocus,
    index: number,
): boolean => {
    return (
        dropdownFocus.focus === 'DROPDOWN_ITEM' &&
        dropdownFocus.itemIndex === index
    );
};

type DropdownOpen = {
    open: true;
};

type DropdownClosed = {
    open: false;
};

type SelectedItem<ItemType> =
    | {
          itemSelected: true;
          item: ItemType;
      }
    | {
          itemSelected: false;
      };

type ItemsNotLoaded = {
    itemsLoaded: false;
};

type ItemsLoaded<ItemType> = {
    itemsLoaded: true;
    items: ReadonlyArray<ItemType>;
} & SelectedItem<ItemType>;

// Internal state
type FilterFunction<ItemType> = (filter: string) => (item: ItemType) => boolean;
type InternalState<ItemType> = {
    filterItems: FilterFunction<ItemType>;
};

// Combined states
type ClosedNotLoadedState = ItemsNotLoaded & DropdownClosed;
type OpenNotLoadedState = ItemsNotLoaded & DropdownOpen;
type OpenLoadedState<ItemType> = ItemsLoaded<ItemType> &
    DropdownOpen & {
        filteredItems: ReadonlyArray<ItemType>;
        filter: string;
        dropdownFocus: DropdownFocus;
    };
type ClosedLoadedState<ItemType> = ItemsLoaded<ItemType> & DropdownClosed;

export type DropdownState<ItemType> = InternalState<ItemType> &
    (
        | ClosedNotLoadedState
        | OpenNotLoadedState
        | OpenLoadedState<ItemType>
        | ClosedLoadedState<ItemType>
    );

export const defaultState = <ItemType>(
    filterItems: FilterFunction<ItemType>,
): DropdownState<ItemType> => ({
    filterItems,
    open: false,
    itemsLoaded: false,
});

// ACTIONS

interface DropdownSelected {
    type: 'DROPDOWN_SELECTED';
}

interface DropdownFilterUpdated {
    type: 'DROPDOWN_FILTER_UPDATED';
    filter: string;
}

interface DropdownItemSelected<ItemType> {
    type: 'DROPDOWN_ITEM_SELECTED';
    item: ItemType;
}

interface DropdownExited {
    type: 'DROPDOWN_EXITED';
}

interface DropdownItemDiscarded {
    type: 'DROPDOWN_ITEM_DISCARDED';
}

interface PopulateItems<ItemType> {
    type: 'POPULATE_DROPDOWN_ITEMS';
    items: ReadonlyArray<ItemType>;
}

interface DropdownNavigateDown {
    type: 'DROPDOWN_NAVIGATE_DOWN';
}

interface DropdownNavigateUp {
    type: 'DROPDOWN_NAVIGATE_UP';
}

export type DropdownActions<ItemType> =
    | DropdownSelected
    | DropdownExited
    | DropdownItemDiscarded
    | DropdownFilterUpdated
    | DropdownItemSelected<ItemType>
    | PopulateItems<ItemType>
    | DropdownNavigateDown
    | DropdownNavigateUp;

// UPDATE

const navigate = <ItemType>(
    direction: 'UP' | 'DOWN',
    filteredItems: ReadonlyArray<ItemType>,
    dropdownFocus: DropdownFocus,
): number => {
    const lastIndex = filteredItems.length - 1;

    switch (dropdownFocus.focus) {
        case 'DROPDOWN_INPUT':
            switch (direction) {
                case 'UP':
                    return lastIndex;
                case 'DOWN':
                    return 0;
                default:
                    throw new Error('Invalid direction');
            }
        case 'DROPDOWN_ITEM':
            switch (direction) {
                case 'UP':
                    if (dropdownFocus.itemIndex <= 0) {
                        return lastIndex;
                    } else {
                        return dropdownFocus.itemIndex - 1;
                    }
                    break;
                case 'DOWN':
                    if (dropdownFocus.itemIndex >= lastIndex) {
                        return 0;
                    } else {
                        return dropdownFocus.itemIndex + 1;
                    }
                default:
                    throw new Error('Invalid direction');
            }
    }
};

const filterDropdownItems = <ItemType>(
    { filterItems }: DropdownState<ItemType>,
    filterString: string,
    items?: ReadonlyArray<ItemType>,
): ReadonlyArray<ItemType> => {
    if (items) {
        return items.filter(filterItems(filterString));
    } else {
        return [];
    }
};

// Reducers

const openLoadedReducer = <ItemType>(
    state: InternalState<ItemType> & OpenLoadedState<ItemType>,
    action: DropdownActions<ItemType>,
): DropdownState<ItemType> => {
    switch (action.type) {
        case 'DROPDOWN_EXITED':
            return {
                ...state,
                open: false,
            };
        case 'DROPDOWN_FILTER_UPDATED':
            return {
                ...state,
                filter: action.filter,
                filteredItems: filterDropdownItems(
                    state,
                    action.filter,
                    state.items,
                ),
                dropdownFocus: {
                    focus: 'DROPDOWN_INPUT',
                },
            };
        case 'DROPDOWN_ITEM_SELECTED':
            return {
                ...state,
                itemSelected: true,
                item: action.item,
                open: false,
            };
        case 'DROPDOWN_NAVIGATE_DOWN':
            return {
                ...state,
                dropdownFocus: {
                    focus: 'DROPDOWN_ITEM',
                    itemIndex: navigate(
                        'DOWN',
                        state.filteredItems,
                        state.dropdownFocus,
                    ),
                },
            };
        case 'DROPDOWN_NAVIGATE_UP':
            return {
                ...state,
                dropdownFocus: {
                    focus: 'DROPDOWN_ITEM',
                    itemIndex: navigate(
                        'UP',
                        state.filteredItems,
                        state.dropdownFocus,
                    ),
                },
            };
        default:
            return state;
    }
};

const closedLoadedReducer = <ItemType>(
    state: InternalState<ItemType> & ClosedLoadedState<ItemType>,
    action: DropdownActions<ItemType>,
): DropdownState<ItemType> => {
    switch (action.type) {
        case 'DROPDOWN_ITEM_DISCARDED':
            return {
                ...state,
                itemSelected: false,
            };
        case 'DROPDOWN_SELECTED':
            return {
                ...state,
                open: true,
                dropdownFocus: { focus: 'DROPDOWN_INPUT' },
                filter: '',
                filteredItems: state.items,
            };
        default:
            return state;
    }
};

const openNotLoadedReducer = <ItemType>(
    state: InternalState<ItemType> & OpenNotLoadedState,
    action: DropdownActions<ItemType>,
): DropdownState<ItemType> => {
    switch (action.type) {
        case 'POPULATE_DROPDOWN_ITEMS':
            return {
                ...state,
                itemsLoaded: true,
                items: action.items,
                itemSelected: false,
                dropdownFocus: { focus: 'DROPDOWN_INPUT' },
                filter: '',
                filteredItems: action.items,
            };
        case 'DROPDOWN_EXITED':
            return {
                ...state,
                open: false,
            };
        default:
            return state;
    }
};

const closedNotLoadedReducer = <ItemType>(
    state: InternalState<ItemType> & ClosedNotLoadedState,
    action: DropdownActions<ItemType>,
): DropdownState<ItemType> => {
    switch (action.type) {
        case 'DROPDOWN_SELECTED':
            return {
                ...state,
                open: true,
            };
        default:
            return state;
    }
};

const dropdownReducer = <ItemType>(
    state: DropdownState<ItemType>,
    action: DropdownActions<ItemType>,
): DropdownState<ItemType> => {
    if (state.itemsLoaded) {
        if (state.open) {
            return openLoadedReducer(state, action);
        } else {
            return closedLoadedReducer(state, action);
        }
    } else {
        if (state.open) {
            return openNotLoadedReducer(state, action);
        } else {
            return closedNotLoadedReducer(state, action);
        }
    }
};

// HOOKS

export const useDropdownReducer = <ItemType>(
    filterItems: FilterFunction<ItemType>,
): [DropdownState<ItemType>, Dispatch<DropdownActions<ItemType>>] => {
    return useReducer<
        Reducer<DropdownState<ItemType>, DropdownActions<ItemType>>
    >(dropdownReducer, defaultState(filterItems));
};
