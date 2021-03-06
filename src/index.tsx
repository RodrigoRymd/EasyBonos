import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from './styles/theme';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/roboto';
import { AuthProvider } from './core/contexts/AuthContext';

ReactDOM.render(
 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
      
        <AuthProvider>
          <App />
        </AuthProvider>

      </BrowserRouter>
    </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
