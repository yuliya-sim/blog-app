
import classNames from 'classnames';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Fragment } from 'react/jsx-runtime';
import axios from 'axios';

import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

const blogUrl = `${import.meta.env.VITE_BACKEND_URL}blog`;
const fetchData = async () => {
    const response = await axios.get(blogUrl);
    const data = await response.data;
    return data;
};

import BlogCard from './blog/BlogCard';
import Spinner from './blog/Spinner';
import { footers } from '../../utils/constants';

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    appBar: {
        position: 'relative',
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(900 + theme.spacing(6))]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`,
    },
    cardHeader: {
        backgroundColor: theme.palette.grey[200],
    },
    cardPricing: {
        display: 'flex',

        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(6),
    },
    cardActions: {
        [theme.breakpoints.up('sm')]: {
            paddingBottom: theme.spacing(2),
        },
    },
    footer: {
        marginTop: theme.spacing(8),
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: `${theme.spacing(6)}px 0`,
    },
});



function Home(props: { classes: any; }) {
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery('exampleQuery', fetchData);
    if (isLoading) return <Spinner />;
    if (error) return <p>Error: {error.message}</p>;
    const { classes } = props;

    const login = () => {
        navigate('/login');
    };
    return (
        <Fragment>
            <CssBaseline />
            <AppBar position="static" color="default" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        Company name
                    </Typography>
                    <Button>Our story</Button>
                    <Button>Membership</Button>
                    <Button>Write</Button>
                    {localStorage.getItem('token') ? (
                        <Button color="primary" variant="outlined" onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/');
                        }}>Logout</Button>
                    ) : (
                        <Button color="primary" variant="outlined" onClick={login} >Sign In</Button>
                    )}
                </Toolbar>
            </AppBar>
            <main className={classes.layout}>
                {/* Welcom unit*/}
                <div className={classes.heroContent}>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        Stay curious.
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" component="p">
                        Discover stories, thinking, and expertise from writers on any topic.
                    </Typography>
                </div>
                {/* End Welcome unit */}


                <Grid spacing={10} alignItems="center" key={data["results"]?.id} >
                    {data["results"]?.map((blog: any) => (
                        <BlogCard props={blog} />

                    ))}
                </Grid>
            </main>
            {/* Footer */}
            <footer className={classNames(classes.footer, classes.layout)}>
                <Grid container spacing={32} justifyContent="space-evenly">
                    {footers.map(footer => (
                        <Grid item xs key={footer.title}>
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                {footer.title}
                            </Typography>
                            {footer.description.map(item => (
                                <Typography key={item} variant="subtitle1" color="textSecondary">
                                    {item}
                                </Typography>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            </footer>
            {/* End footer */}
        </Fragment>
    );
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
