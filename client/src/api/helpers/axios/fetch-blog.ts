import axios from 'axios';

const blogUrl = `${import.meta.env.VITE_BACKEND_URL}blog`;
export const fetchData = async () => {
    const response = await axios.get(blogUrl);
    const data = await response.data;
    return data;
};
