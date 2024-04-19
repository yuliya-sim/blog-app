import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function HomeHeader({ classes }: any) {

    const navigate = useNavigate();
    const login = () => {
        navigate('/login');
    };

    return (
        <AppBar position="static" color="default" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                    Company name
                </Typography>
                <Button>Our story</Button>
                <Button>Membership</Button>
                <Button>Write</Button>
                {localStorage.getItem('token') ? (
                    <Button color="primary" variant="outlined" onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/');
                    }}>Logout</Button>
                ) : (
                    <Button color="primary" variant="outlined" onClick={login} >Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}
