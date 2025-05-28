import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: grey[500],
        },
        secondary: {
            main: '#ffffff',
        },
    },
    typography: {
        fontFamily: `'Integral CF', sans-serif`,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    width: '190px',
                    borderRadius: 100,
                    padding: 10,
                    textTransform: 'none'
                },
                outlined: {
                    border: '1px solid #000000',
                    color: '#000000',
                    width: '190px',
                    borderRadius: 100,
                    padding: 10,
                    textTransform: 'none'
                }
            }
        }
    }
});

export default theme;
