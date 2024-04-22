import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';

import MainFeaturedPost from '../posts/MainFeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';

import { sections, sidebar } from '../../utils/constants';
import { fetchPostsData } from '../../api/helpers/axios/fetch-posts';
import Spinner from '../shared/Spinner';
import BlogHeader from './BlogHeader';


const defaultTheme = createTheme();

export default function Blog() {

    const { id } = useParams();

    const { data, isLoading, error } = useQuery('exampleQuery', () => {
        if (id) {
            return fetchPostsData(id);
        } else {
            throw new Error('id is undefined');
        }
    });

    if (isLoading) return <Spinner />;
    if (error) return <Alert variant="filled" severity="error">An error has occurred. </Alert>

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <BlogHeader title={data?.title} sections={sections} blog_id={data?.blog_id} />
                <main>
                    <MainFeaturedPost blog={data} linkText={''} />
                    <Grid container spacing={5} sx={{ mt: 3 }}>
                        <Main posts={data?.posts} blog_id={data?.blog_id} title={''} comments={[]} />
                        <Sidebar
                            title={sidebar.title}
                            description={sidebar.description}
                            archives={sidebar.archives}
                            social={sidebar.social}
                        />
                    </Grid>
                </main>
            </Container>
            <Footer
                title=""
                description=""
            />
        </ThemeProvider>
    );
}
