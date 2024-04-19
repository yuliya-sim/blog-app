import Grid from '@mui/material/Grid';
import { MainProps } from '../../api/types/Main-props';
import { Post } from '../../api/types/Post';

import AnchorTemporaryDrawer from '../comments/Comments';
import Divider from '@mui/material/Divider';
import { Button } from '@material-ui/core';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import './main.scss';
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default function Main(props: MainProps) {
    const { posts } = props;

    const redirect = (postId: string) => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            window.location.href = '/create-comment/' + postId;
        } else {
            window.location.href = '/login';

        }
    }
    const deletePost = (id: string) => {
        const isLoggedIn = !!localStorage.getItem('token');
        if (isLoggedIn) {
            axios({
                method: 'delete',
                url: `${import.meta.env.VITE_BACKEND_URL}posts/${id}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            window.location.reload();
        } else {
            window.location.href = '/login';
        }
    }

    const formatDate = (date: string) => {
        {
            new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date))
        }
    }
    return (
        <Grid
            item
            xs={12}
            md={8}
            sx={{
                '& .markdown': {
                    py: 3,
                },
            }}
        >
            <Divider />
            {posts?.map((post: Post) => (
                <div key={post.id}>
                    <b> {post.title}</b>{' '}
                    <span> {formatDate(post.createdAt)}</span>
                    <br></br>
                    {post.content}
                    <Divider />
                    <div className='posts-actions'>
                        <AnchorTemporaryDrawer props={post?.comments} />
                        <Button size="small" className="write-btn" >
                            <DeleteOutlinedIcon onClick={() => deletePost(post.id)} />
                        </Button>
                        <Button size="small" className="write-btn" onClick={() => redirect(post.id)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Write">
                                <path d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z" fill="currentColor"></path>
                                <path d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2" stroke="currentColor"></path>
                            </svg>Write
                        </Button>
                    </div>
                    <Divider />
                </div>
            ))}
        </Grid>
    );
}
