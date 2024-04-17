import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Avatar, Chip, Link } from '@material-ui/core';
import './home.scss';



const Img = styled('img')({
    margin: 'auto',
    display: 'flex',
    maxWidth: '100%',
    maxHeight: '100%'

});

export default function BlogCard({ props }) {
    const handleClick = () => {
        console.info('You clicked the Chip.');
    }
    return (
        <Paper
            sx={{
                p: 2,
                marginBottom: '48px',

                maxWidth: 1200,
                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
        >
            <Grid container spacing={2}>
                <Grid item>
                    <ButtonBase sx={{ width: 200, height: 134 }}>
                        <Img alt="complex" src={"https://source.unsplash.com/random"} />
                    </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                {(props.firstName || props.lastName) && (
                                    <div className='author'>
                                        <Avatar
                                            alt={`${props.firstName || ''} ${props.lastName || ''}`}
                                            src={`${props.avatarUrl || '/static/images/avatar/1.jpg'}`}
                                        />
                                        {`${props.firstName || ''} ${props.lastName || ''}`}
                                    </div>
                                )}

                            </Typography>
                            <Typography variant="h4" gutterBottom>
                                <Link href={props.slug} underline="none">
                                    {props.title}
                                </Link>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <div className='date-link'>
                                    <span>{new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }).format(new Date(props?.createdAt))}</span>

                                    <Grid item>
                                        <Chip label={props.theme ? props.theme : 'not established'} onClick={handleClick} />
                                    </Grid></div>

                            </Typography>
                        </Grid>

                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" component="div">

                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" className="" aria-label="Add to list bookmark button">
                                <path d="M18 2.5a.5.5 0 0 1 1 0V5h2.5a.5.5 0 0 1 0 1H19v2.5a.5.5 0 1 1-1 0V6h-2.5a.5.5 0 0 1 0-1H18V2.5zM7 7a1 1 0 0 1 1-1h3.5a.5.5 0 0 0 0-1H8a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V7z" fill="currentColor"></path>
                            </svg>

                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
