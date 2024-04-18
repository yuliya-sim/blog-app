

import axios from 'axios';
export const deleteComment = async (commentId: string) => {

    const token = localStorage.getItem('token');
    if (!token) return;

    const url = `${import.meta.env.VITE_BACKEND_URL}comment/${commentId}`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
        await axios.delete(url, { headers });
        window.location.reload();
    } catch (error) {
        console.error('Failed to delete comment:', error);
    }
};
