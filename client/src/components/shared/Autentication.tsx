import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../api/helpers/check-token-expired';


const Authentication = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const isExpired = isTokenExpired(storedToken);
            if (!isExpired) {
                setIsAuthenticated(true);
                setToken(storedToken);
            }
        }
    };



    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setToken(null);
        navigate('/');
    };

    const signIn = () => {
        navigate('/login');
    };

    return (
        <div>
            {isAuthenticated ? (
                <Button variant="outlined" size="small" onClick={logout}>Logout</Button>
            ) : (
                <Button variant="outlined" size="small" onClick={signIn}>Sign In</Button>
            )}
        </div>
    );
};

export default Authentication;
