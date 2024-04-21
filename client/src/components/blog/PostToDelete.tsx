import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { isTokenExpired } from '../../api/helpers/check-token-expired';

import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const PostToDelete = (post: { id: string; }) => {
    const navigate = useNavigate();

    const deletePost = async (id: string) => {
        const token = localStorage.getItem('token');
        const isLoggedIn = !isTokenExpired(token) && token !== null;

        if (isLoggedIn) {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}posts/${id}`;
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                await axios.delete(url, { headers });
                navigate('/');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        } else {
            navigate('/login');
        }
    }

    return (
        <Button size="small" className="write-btn" >
            <DeleteOutlinedIcon color='action' onClick={() => deletePost(post.id)} />
        </Button>

    );
};

export default PostToDelete;
