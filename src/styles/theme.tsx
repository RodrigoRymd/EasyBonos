import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#390B0B',
      main: '#390B0B',
      dark: '#390B0B',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#ffffff',
      contrastText: '#000',
    }
  },
});

export default theme;