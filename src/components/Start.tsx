import React from 'react';

export interface StartProps {
    compiler: string;
    framework: string;
}

export const Start = ({ compiler, framework }: StartProps): JSX.Element => (
    <h1>
        Hello from {compiler} and {framework}
    </h1>
);
