import React from "react";
import { createContext, useReducer } from "react";


type Type = "loading" | "done";

type Action = {
    type: Type;
    payload?: any;
};

type Dispatch = (action: Action) => void;
type State = { state: boolean };
type SpinnerProviderProps = { children: React.ReactNode };


const initialState: State = {
    state: false
}

const SpinnerContext = createContext<{ spinnerState: State, spinnerDispatcher: Dispatch } | undefined>(undefined);

function spinnerReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'loading': {
            return { state: true } as State;
        }
        case 'done': {
            return { state: false } as State;
        }
        default:
            return initialState;
    }
}

function SpinnerProvider({ children }: SpinnerProviderProps) {
    const [state, dispatch] = useReducer(spinnerReducer, { state: false });
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = {
        spinnerState: state,
        spinnerDispatcher: dispatch
    };

    return <SpinnerContext.Provider value={value}>{children}</SpinnerContext.Provider>;
}


function useSpinner() {
    const context = React.useContext(SpinnerContext);
    if (context === undefined) {
        throw new Error('useCount must be used within a SpinnerProvider');
    }
    return context;
}

export { SpinnerProvider, useSpinner };