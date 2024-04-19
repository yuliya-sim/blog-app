import { useQuery } from 'react-query';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Alert from '@mui/material/Alert';
import { HomeHeader } from './HomeHeader';
import { HomeMain } from './HomeMain';
import { HomeFooter } from './HomeFooter';
import Spinner from '../shared/Spinner';

import { styles } from './styles';
import { fetchData } from '../../api/helpers/fetch-blog';


function Home(props: { classes: any; }) {
    const { classes } = props;

    const { data, isLoading, error } = useQuery('exampleQuery', fetchData);

    if (isLoading) return <Spinner />;
    if (error) return <Alert variant="filled" severity="error">An error has occurred. </Alert>

    return (
        <>
            <CssBaseline />
            <HomeHeader classes={classes} />
            <HomeMain data={data} classes={classes} />
            <HomeFooter classes={classes} />
        </>
    );
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
