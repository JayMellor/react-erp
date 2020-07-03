import { ReactNode } from 'react';

export type NavigationKey =
    | 'ArrowLeft'
    | 'ArrowRight'
    | 'ArrowUp'
    | 'ArrowDown'
    | 'Escape'
    | 'Enter'
    | 'Tab';

export type TypingKey = ' ' | 'Backspace' | 'Delete';

export interface ChildProps {
    children?: ReactNode;
}
