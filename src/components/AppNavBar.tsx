import { AppBar, Link as StyledLink, makeStyles, Toolbar, Typography, Button, MenuItem, IconButton, Drawer, useTheme, colors } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import MenuIcon from '@material-ui/icons/Menu';
import { useAuth } from '../core/contexts/AuthContext';
import { ReactComponent as LogoIcon } from '../icons/logo.svg';


const headersData = [
    {
        label: "Inicio",
        href: "/home",
    },
    {
        label: "Calculadora",
        href: "/calculator",
    },
    {
        label: "Compra/Venta",
        href: "/buysell",
    },
    {
        label: "Perfil",
        href: "/profile",
    },
];

const useStyles = makeStyles((theme) => ({
    header: {
        paddingRight: "79px",
        paddingLeft: "118px",
        zIndex: theme.zIndex.drawer + 1,
        "@media (max-width: 900px)": {
            paddingLeft: 0,
        },
    },
    logo: {
        fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        color: "#FFFEFE",
        textAlign: "left",
    },
    menuButton: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 700,
        size: "18px",
        marginLeft: "38px",
        color: theme.palette.primary.main
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    drawerContainer: {
        padding: "20px 30px",
    },
    drawerLink: {
        color: theme.palette.secondary.main,
        textDecoration: "none"
    },

    drawer: {
        backgroundColor: theme.palette.primary.main
    },

    title: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
    },
    icon: {
        margin: "0.5rem 1rem",
        height: "3rem",
        width: "3rem",
        cursor: "pointer",
        fill: theme.palette.secondary.main,
        [theme.breakpoints.down('xs')]: {
            height: "2rem",
            width: "2rem",
            margin: "0.2rem 1rem 0.2rem 1rem",
        }
    },

    titleText: {
        lineHeight: "4rem",
        textAlign: "center",
        color: theme.palette.secondary.main,
        [theme.breakpoints.down('xs')]: {
            display: "none"
        }
    },

    logoutButton: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 700,
        size: "18px",
        marginLeft: "38px",
        backgroundColor: colors.red[900],
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: colors.red[900],
        },
    },

    logoutDrawerLink: {
        color: colors.red[900],
        textDecoration: "none"
    },

}));



function AppNavBar(props: any) {

    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });

    const { mobileView, drawerOpen } = state;
    const { authDispatch } = useAuth();
    const theme = useTheme();
    const history = useHistory();
    const classes = useStyles();


    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 900
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({ ...prevState, mobileView: false }));
        };

        setResponsiveness();
        window.addEventListener("resize", () => setResponsiveness());

        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        }
    }, []);


    const toHome = (event: any) => {
        history.push('/');
    }

    const logo = (
        <div className={classes.title}>
            <LogoIcon className={classes.icon} onClick={toHome}/>
            <Typography className={classes.titleText} variant="h6" component="h1">
                Easy Bonos
            </Typography>
        </div>
    );

    const getMenuButtons = () => {
        let buttons = headersData.map(({ label, href }) => {
            return (
                <Button
                    variant="contained"
                    {...{
                        key: label,
                        color: "secondary",
                        to: href,
                        component: Link,
                        className: classes.menuButton,
                    }}
                >
                    {label}
                </Button>
            );
        });

        buttons.push(
            <Button
                variant="contained"
                color="secondary"
                className={classes.logoutButton}
                key="logout"
                onClick={() => authDispatch({ type: "logout" })}>
                Salir
            </Button>
        );
        return buttons;
    };

    const displayDesktop = () => {
        return (
            <Toolbar className={classes.toolbar}>
                {logo}
                <div>{getMenuButtons()}</div>
            </Toolbar>
        );
    };

    const getDrawerChoices = () => {
        let buttons = headersData.map(({ label, href }) => {
            return (
                <StyledLink
                    {...{
                        component: Link,
                        to: href,
                        color: "inherit",
                        className: classes.drawerLink,
                        key: label,
                    }}
                >
                    <MenuItem>{label}</MenuItem>
                </StyledLink>
            );
        });

        buttons.push(
            <StyledLink key="logout" className={classes.logoutDrawerLink} onClick={() => authDispatch({ type: "logout" })}>
                <MenuItem>Salir</MenuItem>
            </StyledLink>
        );
        return buttons;
    };


    const displayMobile = () => {
        const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }));
        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));

        return (
            <Toolbar>
                <IconButton
                    {...{
                        edge: "start",
                        color: "inherit",
                        "aria-label": "menu",
                        "aria-haspopup": "true",
                        onClick: handleDrawerOpen,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    classes={{ paper: classes.drawer }}
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={classes.drawerContainer}>{getDrawerChoices()}</div>
                </Drawer>

                <div>{logo}</div>
            </Toolbar>
        );
    };



    return (
        <AppBar className={classes.header} position="sticky">
            {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
    )

}

export default AppNavBar;