import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './Header';
import MainFeaturedPost from '../../posts/MainFeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';

import { sections, sidebar } from '../../../utils/constants';


const defaultTheme = createTheme();

export default function Blog() {

    const { id } = useParams();

    const fetchData = async () => {

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}posts/slug/${id}`);
        const data = await response.data;
        return data;
    };
    const { data, isLoading, error } = useQuery('exampleQuery', fetchData);
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title={data?.title} sections={sections} blog_id={data?.blog_id} />
                <main>
                    <MainFeaturedPost blog={data} />
                    <Grid container spacing={5} sx={{ mt: 3 }}>
                        <Main posts={data?.posts} blog_id={data?.blog_id} />
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
