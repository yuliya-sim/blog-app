import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';

import './header.scss';
interface HeaderProps {
    sections: ReadonlyArray<{
        title: string;
        url: string;
    }>;
    title: string;
    blog_id: string
}

export default function Header(props: HeaderProps) {
    const { sections, title, blog_id } = props;
    const navigate = useNavigate();

    const login = () => {
        navigate('/login');
    };
    return (
        <>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Button size="small">Subscribe</Button>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1 }}
                >
                    {title}
                </Typography>
                <div className='header-buttons'>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>

                    <IconButton onClick={() => {
                        navigate(`/create-post/${blog_id}`);
                    }}>
                        <ModeOutlinedIcon />
                        WP
                    </IconButton>

                    <IconButton onClick={login}>
                        <ModeOutlinedIcon />
                    </IconButton>


                    <Button variant="outlined" size="small" onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/');
                    }}>
                        LOGOUT
                    </Button>

                    <Button variant="outlined" size="small" onClick={login}>
                        Sign In
                    </Button>

                </div>
            </Toolbar>
            <Toolbar
                component="nav"
                variant="dense"
                sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
            >
                {sections?.map((section) => (
                    <Link
                        color="inherit"
                        noWrap
                        key={section.title}
                        variant="body2"
                        href={section.url}
                        sx={{ p: 1, flexShrink: 0 }}
                    >
                        {section.title}
                    </Link>
                ))}
            </Toolbar>
        </>
    );
}
