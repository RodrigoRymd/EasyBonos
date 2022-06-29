import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackBar } from '../core/contexts/SnackBarContext';
import { SnackbarContent } from '@material-ui/core';



const useStyles = makeStyles((theme: Theme) => ({
    messsage: {
        color: "white",
    }
}));

function SnackbarDisplay() {

    const classes = useStyles();
    const { snackbarState, snackbarDispatcher } = useSnackBar();

    const handleClose = () => {
        snackbarDispatcher({
            type: "none"
        });
    }


    let snackbar: any = null;

    if (snackbarState.state) { 
        let snackbarStyle: any = {};
        switch (snackbarState.type) {
            case 'success': {
                snackbarStyle = {
                    backgroundColor: "#4caf50"
                };
                break;
            }
            case 'info': {
                snackbarStyle = { backgroundColor: "#2196f3" };
                break;
            }
            case 'error': {
                snackbarStyle = { backgroundColor: "#f44336" };
                break;
            }
            case 'warning': {
                snackbarStyle = { backgroundColor: "#ff9800" };
                break;
            }
            default:
                break;
        }
        
        snackbar = <Snackbar
            open={snackbarState.state}
            autoHideDuration={2000}
            onClose={handleClose}
            key="bottomcenter"
        >
            <SnackbarContent style={snackbarStyle} className={classes.messsage} aria-describedby="message-id"
                message={<span id="message-id">{snackbarState.message}</span>}
            />
        </Snackbar>;
    }
    return (snackbar);
}


export default SnackbarDisplay;