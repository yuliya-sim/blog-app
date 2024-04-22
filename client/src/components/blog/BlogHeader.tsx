import { useNavigate } from 'react-router-dom';

import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';

import { HeaderProps } from '../../api/types';
import Authentication from '../shared/Autentication';
import { isTokenExpired } from '../../api/helpers/check-token-expired';
import { AddPostButtonStyles, ThemeHeaderNav, ToolbarStyles } from './styles';

import './blog.scss';
export default function BlogHeader(props: HeaderProps) {
    const { sections, title, blog_id } = props;
    const navigate = useNavigate();

    const navigateToCreatePost = () => {
        const token = localStorage.getItem('token');

        if (!isTokenExpired(token) && token !== null) {
            navigate(`/create-post/${blog_id}`);
        } else {
            navigate('/');
        }
    };

    return (
        <>
            <Toolbar sx={ToolbarStyles}>
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
                <div className='header-buttons' >
                    <IconButton sx={{ padding: 1 }} onClick={navigateToCreatePost} style={AddPostButtonStyles}>
                        <PostAddOutlinedIcon fontSize="large" />
                    </IconButton>
                    <Authentication />
                </div>
            </Toolbar>
            <Toolbar component="nav" variant="dense" sx={ThemeHeaderNav}  >
                {sections && sections.length > 0 ? (
                    sections.map((section, index) => (
                        <Link
                            color="inherit"
                            noWrap
                            key={`section-${index}`}
                            variant="body2"
                            href={section.url}
                            sx={{ p: 1, flexShrink: 0 }}
                        >
                            {section.title}
                        </Link>
                    ))
                ) : null}
            </Toolbar>
        </>
    );
}
