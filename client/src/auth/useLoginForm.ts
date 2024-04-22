import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export function useCreateComment() {
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (e.currentTarget.checkValidity()) {
            try {
                await axios({
                    method: 'post',
                    url: `${import.meta.env.VITE_BACKEND_URL}comment/${id}`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    data: {
                        content: content,
                    }
                });
                navigate('/');
            } catch (error) {
                console.error('Sign in failed:', error);
            }
        }
    }

    return {
        content,
        setContent,
        handleSubmit,
    };
}
