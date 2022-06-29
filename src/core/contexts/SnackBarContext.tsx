import React from "react";
import { createContext, useReducer } from "react";

type Type = "none" | "success" | "info" | "error" | "warning";

type Action = {
    type: Type;
    payload?: any;
};

type Dispatch = (action: Action) => void;

type State = {
    state: boolean,
    type: Type,
    message?: string,
};

type SnackbarProviderProps = { children: React.ReactNode };

const initialState: State = {
    state: false,
    type: "none",
}

const SnackbarContext = createContext<{ snackbarState: State, snackbarDispatcher: Dispatch } | undefined>(undefined);

function snackbarReducer(state: State, action: Action): State {

    let newState: State = {
        state: true,
        message: action.payload,
        type: action.type
    };

    switch (action.type) {
        case 'success': {
            break;
        }
        case 'info': {
            break;
        }
        case 'error': {
            break;
        }
        case 'warning': {
            break;
        }
        case 'none': {
            newState.state = false;
            break;
        }
        default:
            return initialState;
    }
    
    return newState;
}

function SnackBarProvider({ children }: SnackbarProviderProps) {
    const [state, dispatch] = useReducer(snackbarReducer, initialState);
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = {
        snackbarState: state,
        snackbarDispatcher: dispatch
    };

    return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
}


function useSnackBar() {
    const context = React.useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useCount must be used within a SnackbarProvider');
    }
    return context;
}

export { SnackBarProvider, useSnackBar };