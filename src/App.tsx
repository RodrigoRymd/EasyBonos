import { lazy, Suspense } from 'react';


import './App.css';

import { Switch, Route, Redirect } from 'react-router-dom';
import { SpinnerProvider } from './core/contexts/SpinnerContext';
import { SpinnerDisplay, Spinner } from './components/Spinner';
import LoginGuard from './core/guards/LoginGuard';
import AppLayout from './layouts/AppLayout';
import LoginLayout from './layouts/LoginLayout';
import LogoutGuard from './core/guards/LogoutGuard';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { SnackBarProvider } from './core/contexts/SnackBarContext';
import SnackbarDisplay from './components/SnackbarDisplay';

const Home = lazy(() => import("./components/Home"));
const Calculator = lazy(() => import("./components/Calculator"));
const BuySell = lazy(() => import("./components/BuySell"));
const Profile = lazy(() => import('./components/Profile'));
const InitialForm = lazy(() => import('./components/InitialForm'));

function App() {

  return (
    <Suspense fallback={<Spinner />}>

      <MuiPickersUtilsProvider utils={MomentUtils}>

        <SnackBarProvider>
          <SpinnerProvider>
            <Switch>
              <Route exact path="/">
                <Redirect to="/home"></Redirect>
              </Route>

              <LogoutGuard path="/login">
                <LoginLayout component={InitialForm} />
              </LogoutGuard>

              <LoginGuard path="/home">
                <AppLayout component={Home}></AppLayout>
              </LoginGuard>

              <LoginGuard path="/calculator">
                <AppLayout component={Calculator}></AppLayout>
              </LoginGuard>

              <LoginGuard path="/buysell">
                <AppLayout component={BuySell}></AppLayout>
              </LoginGuard>

              <LoginGuard path="/profile">
                <AppLayout component={Profile}></AppLayout>
              </LoginGuard>

            </Switch>

            <SnackbarDisplay />
            <SpinnerDisplay />

          </SpinnerProvider>
        </SnackBarProvider>

      </MuiPickersUtilsProvider>
    </Suspense>

  );
}

export default App;
