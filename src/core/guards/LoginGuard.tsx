import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginGuard(props: any) {
  // keep in mind path is required as a prop
  const { path, children, ...rest } = props;
  // using the AuthContext to get the state variable isAuthenticated
  const { authState } = useAuth();

  return (
    <Route
      path={path}
      {...rest}
      render={({ location }) =>
        authState.auth ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    />
  );
}

export default LoginGuard;
