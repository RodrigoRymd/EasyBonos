
import { Button, Card, CardContent, Grid, makeStyles, Typography, useTheme } from "@material-ui/core";
import { useState } from "react";
import Login from "./Login";
import { ReactComponent as LogoIcon } from "../icons/logo.svg";
import Register from "./Register";


const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url(/images/background.jpg)',
        backgroundSize: "cover",
        overflow: "hidden"
    },
    card: {
        //width: "max(50%,50rem)",
        minWidth: "50%",
        maxWidth: "50rem",
        backgroundColor: "#660000",
    },
    column: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        margin: "1rem",
        width: "8rem",
        [theme.breakpoints.down('xs')]: {
            margin: "0rem 1rem",
        }
    },
    buttons: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        flex: 3,
        flexDirection: "column",
        [theme.breakpoints.down('xs')]: {
            flexDirection: "row",
            flex: 2
        }
    },
    icon: {
        flex: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.secondary.main,
        "& svg": {
            height: "5rem",
            width: "5rem",
        },
        [theme.breakpoints.down('xs')]: {
            margin: "0rem 0rem 2rem 0rem"
        }
    },
    iconSvg: {
        margin: "0.5rem",
        fill: theme.palette.secondary.main,
        [theme.breakpoints.down('xs')]: {
            margin: "2rem",
            height: "5rem",
            width: "5rem",
        }
    }
}));

function InitialForm({ setLogin }: any) {

    const [option, setOption] = useState(0);
    const classes = useStyles();
    const theme = useTheme();

    let content = null;

    if (option === 0) {
        content = <Login setLogin={setLogin}></Login>;
    } else {
        content = <Register></Register>
    }

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardContent>
                    <Grid container justify="center" spacing={3} alignItems="stretch">
                        <Grid item xs={12} md={3}>
                            <div className={classes.column}>

                                <div className={classes.icon}>
                                    <LogoIcon className={classes.iconSvg}/>
                                    <Typography variant="h5">Easy Bonos</Typography>
                                </div>

                                <div className={classes.buttons}>
                                    <Button className={classes.button} variant="outlined" color="secondary" onClick={() => setOption(0)}>
                                        Ingresar
                                    </Button>
                                    <Button className={classes.button} variant="outlined" color="secondary" onClick={() => setOption(1)}>
                                        Registrarse
                                    </Button>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            {content}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </div>);
}

export default InitialForm;