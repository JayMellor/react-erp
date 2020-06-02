import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './Store';
import { ReactNode } from 'react';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export type NavigationKey =
    | 'ArrowLeft'
    | 'ArrowRight'
    | 'ArrowUp'
    | 'ArrowDown'
    | 'Escape'
    | 'Enter'
    | 'Tab';

export interface ChildProps {
    children: ReactNode;
}
