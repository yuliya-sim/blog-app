
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
export async function Login(formData: any) {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}auth/login`,
            formData
        );
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        window.location.href = '/';
    } catch (error) {
        console.error('Sign in failed:', error);
    }
}   
