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

type DropdownOpen<ItemType> = {
    open: true;
} & DropdownFocus;

type DropdownClosed = {
    open: false;
};

type ItemSelected<ItemType> =
    | {
          itemSelected: true;
          item: ItemType;
      }
    | {
          itemSelected: false;
      };

type FilterFunction<ItemType> = (filter: string) => (item: ItemType) => boolean;

export type DropdownState<ItemType> = {
    filter: string;
    filterItems: FilterFunction<ItemType>;
    items?: ReadonlyArray<ItemType>;
    filteredItems?: ReadonlyArray<ItemType>;
} & ItemSelected<ItemType> &
    (DropdownOpen<ItemType> | DropdownClosed);

export const defaultState = <ItemType>(
    filterItems: FilterFunction<ItemType>,
): DropdownState<ItemType> => ({
    open: false,
    filter: '',
    itemSelected: false,
    filterItems,
});

// ACTIONS

interface OpenDropdown {
    type: 'OPEN_DROPDOWN';
    filter: string;
}

interface UpdateDropdownFilter {
    type: 'UPDATE_DROPDOWN_FILTER';
    filter: string;
}

interface CloseDropdownWithSelection<ItemType> {
    type: 'CLOSE_DROPDOWN_WITH_SELECTION';
    item: ItemType;
}

interface CloseDropdownNoSelection {
    type: 'CLOSE_DROPDOWN_NO_SELECTION';
}

interface ClearSelection {
    type: 'CLEAR_DROPDOWN_SELECTION';
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
    | OpenDropdown
    | CloseDropdownNoSelection
    | ClearSelection
    | UpdateDropdownFilter
    | CloseDropdownWithSelection<ItemType>
    | PopulateItems<ItemType>
    | DropdownNavigateDown
    | DropdownNavigateUp;

// UPDATE

const navigate = <ItemType>(direction: 'UP' | 'DOWN') => (
    // change function to not return whole state
    state: DropdownState<ItemType>,
): DropdownState<ItemType> => {
    if (!state.open || !state.filteredItems) {
        return state;
    }

    let index = 0;
    const lastIndex = state.filteredItems.length - 1;

    switch (state.focus) {
        case 'DROPDOWN_INPUT':
            switch (direction) {
                case 'UP':
                    index = lastIndex;
                    break;
                case 'DOWN':
                    index = 0;
            }
            return {
                ...state,
                focus: 'DROPDOWN_ITEM',
                itemIndex: index,
            };

        case 'DROPDOWN_ITEM':
            switch (direction) {
                case 'UP':
                    if (state.itemIndex <= 0) {
                        index = lastIndex;
                    } else {
                        index = state.itemIndex - 1;
                    }
                    break;
                case 'DOWN':
                    if (state.itemIndex >= lastIndex) {
                        index = 0;
                    } else {
                        index = state.itemIndex + 1;
                    }
            }
            return {
                ...state,
                itemIndex: index,
            };
    }
};

const filterDropdownItems = <ItemType>(
    { filterItems }: DropdownState<ItemType>,
    filter: string,
    items?: ReadonlyArray<ItemType>,
): ReadonlyArray<ItemType> => {
    if (items) {
        return items.filter(filterItems(filter));
    } else {
        return [];
    }
};

const dropdownReducer = <ItemType>(
    state: DropdownState<ItemType>,
    action: DropdownActions<ItemType>,
): DropdownState<ItemType> => {
    switch (action.type) {
        case 'OPEN_DROPDOWN':
            return {
                ...state,
                open: true,
                focus: 'DROPDOWN_INPUT',
                filter: action.filter,
                filteredItems: filterDropdownItems(
                    state,
                    action.filter,
                    state.items,
                ),
            };
        case 'CLOSE_DROPDOWN_NO_SELECTION':
            return {
                ...state,
                open: false,
            };
        case 'CLOSE_DROPDOWN_WITH_SELECTION':
            return {
                ...state,
                open: false,
                filter: '',
                itemSelected: true,
                item: action.item,
            };
        case 'CLEAR_DROPDOWN_SELECTION':
            return {
                ...state,
                itemSelected: false,
            };
        case 'UPDATE_DROPDOWN_FILTER':
            return {
                ...state,
                focus: 'DROPDOWN_INPUT',
                filter: action.filter,
                filteredItems: filterDropdownItems(
                    state,
                    action.filter,
                    state.items,
                ),
            };
        case 'POPULATE_DROPDOWN_ITEMS':
            return {
                ...state,
                items: action.items,
                filteredItems: filterDropdownItems(
                    state,
                    state.filter,
                    action.items,
                ),
            };
        case 'DROPDOWN_NAVIGATE_DOWN':
            return navigate<ItemType>('DOWN')(state);

        case 'DROPDOWN_NAVIGATE_UP':
            return navigate<ItemType>('UP')(state);
        default:
            return state;
    }
};

export const useDropdownReducer = <ItemType>(
    filterItems: FilterFunction<ItemType>,
): [DropdownState<ItemType>, Dispatch<DropdownActions<ItemType>>] => {
    return useReducer<
        Reducer<DropdownState<ItemType>, DropdownActions<ItemType>>
    >(dropdownReducer, defaultState(filterItems));
};
