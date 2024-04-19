
import axios from 'axios';
export const fetchPostsData = async (id: string) => {

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}posts/slug/${id}`);
    const data = await response.data;
    return data;
};
