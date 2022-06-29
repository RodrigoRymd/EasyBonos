import React from "react";
import { createContext, useReducer } from "react";
import { User } from "../models/dtos/user";
import { Role } from "../models/enums/role";

type Type = "login" | "logout";

type Action = {
  type: Type;
  payload?: any;
};

type Dispatch = (action: Action) => void;

type State = {
  auth: boolean;
  token: string;
};

type AuthProviderProps = { children: React.ReactNode };

const initialState: State = {
  auth: false,
  token: "",
};

const AuthContext = createContext<
  { authState: State; authDispatch: Dispatch } | undefined
>(undefined);

function authReducer(state: State, action: Action): State {
  switch (action.type) {
    case "login": {
      return {
        auth: true,
        token: action.payload,
      };
    }
    case "logout": {
      return {
        auth: false,
        token: "",
      };
    }
    default:
      return initialState;
  }
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const value = { authState: state, authDispatch: dispatch };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
