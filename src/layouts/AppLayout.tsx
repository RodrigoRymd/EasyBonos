import { Container, makeStyles, Theme } from '@material-ui/core';
import AppNavBar from '../components/AppNavBar';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: "2rem",
        marginBottom: "2rem"
    }
}));

const AppLayout = ({ component: Component, ...props }: any) => {
    const classes = useStyles();
    return (
        <div>
            <AppNavBar></AppNavBar>
            <Container className={classes.root}>
                <Component {...props} />
            </Container>
        </div>
    );
};

export default AppLayout;