import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    SomethingState,
    ADD_SOMETHING,
    AddSomethingAction,
    RemoveSomethingAction,
    REMOVE_SOMETHING,
} from './Store';

export const Start = (): JSX.Element => {
    const [input, setInput] = useState('');
    const something = useSelector(({ something }: SomethingState) => something);
    const dispatch = useDispatch();

    return (
        <>
            <input
                type="text"
                onChange={(event): void => setInput(event.target.value)}
            ></input>
            <button
                onClick={(): AddSomethingAction =>
                    dispatch({
                        type: ADD_SOMETHING,
                        payload: input,
                    })
                }
            ></button>
            <button
                onClick={(): RemoveSomethingAction =>
                    dispatch({
                        type: REMOVE_SOMETHING,
                    })
                }
            >
                Remove
            </button>
            <h2>something: {something}</h2>
        </>
    );
};
