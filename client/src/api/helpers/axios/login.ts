
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
import { useNavigate } from 'react-router-dom';
export async function Login(formData: any) {
    const navigate = useNavigate();
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}auth/login`,
            formData
        );
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        window.location.href = '/';
        navigate('/');
    } catch (error) {
        console.error('Sign in failed:', error);
    }
}   
