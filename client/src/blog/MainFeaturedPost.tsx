import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

interface MainFeaturedPostProps {
    linkText: string;
    blog: {
        blog_content: string;
        title: string;
        linkText: string;
    };
}

export default function MainFeaturedPost(props: MainFeaturedPostProps) {
    const { blog } = props;

    return (
        <Paper
            sx={{
                position: 'relative',
                backgroundColor: 'grey.800',
                color: '#fff',
                mb: 4,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(https://source.unsplash.com/random?wallpapers)`,
            }}
        >
            {/* Increase the priority of the hero background image */}
            {<img style={{ display: 'none' }} src="https://source.unsplash.com/random?wallpapers" alt="Blog img" />}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    backgroundColor: 'rgba(0,0,0,.3)',
                }}
            />
            <Grid container>
                <Grid item md={6}>
                    <Box
                        sx={{
                            position: 'relative',
                            p: { xs: 3, md: 6 },
                            pr: { md: 0 },
                        }}
                    >
                        <Typography variant="h5" color="inherit" paragraph>
                            {blog.blog_content && blog.blog_content.length > 300 ?
                                blog.blog_content.slice(0, 300) + '...' :
                                blog.blog_content}
                        </Typography>
                        <Link variant="subtitle1" href="#">
                            {blog.linkText ? props.linkText : "Continue reading..."}
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
