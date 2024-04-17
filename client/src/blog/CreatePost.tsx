import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
import './createPost.scss';

export default function CreatePost() {

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (e.currentTarget.checkValidity()) {
            try {

                axios({
                    method: 'post',
                    url: `${import.meta.env.VITE_BACKEND_URL}posts/${id}`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    data: {
                        content,
                        title
                    }
                });
                navigate('/');
            } catch (error) {
                console.error('Sign in failed:', error);
            }
        }
    }


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& .MuiTextField-root': {
                    m: 1,
                    width: '25ch',
                },
            }}
            noValidate
            autoComplete="off"
        >

            <div className='create-post'>
                <TextField
                    id="outlined-content"
                    label="Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    id="outlined-content"
                    label="Content"
                    variant="outlined"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

            </div>
            <Button type="submit" variant="contained">
                Submit
            </Button>
        </Box>
    );
}
