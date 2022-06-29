import { CircularProgress, makeStyles, Theme } from "@material-ui/core";
import { useSpinner } from "../core/contexts/SpinnerContext";



const useStyles = makeStyles((theme: Theme) => ({
    spinner: {
        position: "fixed",
        zIndex: 9999,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#390B0B",
    },
}));

function Spinner() {
    const classes = useStyles();
    return (
        <div className={classes.spinner}>
            <CircularProgress color="secondary"/>
        </div>
    )
}

function SpinnerDisplay() {
    const { spinnerState } = useSpinner();
    if (spinnerState.state) {
        return (<Spinner></Spinner>);
    }
    return null;
}

export { SpinnerDisplay, Spinner };