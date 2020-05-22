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

export interface ChildProps {
    children: ReactNode;
}
