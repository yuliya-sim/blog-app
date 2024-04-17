import * as React from 'react';

import axios from 'axios';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';

import { Avatar, IconButton, ListItemAvatar } from '@material-ui/core';

import './comments.scss'

type Anchor = 'right';

export default function AnchorTemporaryDrawer({ props }) {
    const [state, setState] = React.useState({
        right: false,
    });

    const toggleDrawer = (anchor: Anchor, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        if (['keydown', 'Tab', 'Shift'].includes(event.type)) return;
        if (props.length === 0) return;
        setState({ ...state, [anchor]: open });
    };

    const calculateTimePassed = (givenDate: Date) => {
        const dateComment = new Date(givenDate);
        const now = new Date();
        const delta = Math.abs(now - dateComment) / 1000;

        const days = Math.floor(delta / 86400);
        const hours = Math.floor(delta / 3600) % 24;
        const minutes = Math.floor(delta / 60) % 60;

        if (days > 0) {
            return `${days} days ago`;
        } else if (hours > 0) {
            return `${hours} hours ago`;
        } else {
            return `${minutes} minutes ago`;
        }
    }

    /**
     * A function that deletes a comment based on the provided commentId.
     *
     * @param {string} commentId - The id of the comment to be deleted
     * @return {Promise<void>} Promise that resolves once the comment is deleted
     */
    const deleteComment = async (commentId: string) => {
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

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: '100%' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >

            {props?.map((data: any) => (
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} key={data.id} className='authors-comments'>
                    <div >
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar
                                    alt={`${data.user.firstName || ''} ${data.user.lastName || ''}`}
                                    src={`${data.user.avatarUrl || '/static/images/avatar/1.jpg'}`} />
                            </ListItemAvatar>
                            <ListItemText primary={(data.user.firstName || data.user.lastName) && (
                                <div className='author'>

                                    <div> {`${data.user.firstName || ''} ${data.user.lastName || ''}`} </div>
                                </div>
                            )} secondary={calculateTimePassed(data.createdAt)}
                            />
                        </ListItem>
                        <ListItemButton>
                            <ListItemText primary={data.content} />
                        </ListItemButton>
                        <Box key={data.id} m={1}>
                            <Button variant="outlined" color="error" onClick={() => deleteComment(data.id)}>
                                < DeleteSweepOutlinedIcon />
                            </Button>
                        </Box>

                    </div>

                </List>
            ))}

        </Box >
    );

    return (
        <div>
            {(['right'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
                        </svg>
                        {props.length}
                    </Button>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        <Box
                            sx={{
                                width: { sm: 300, md: 500 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                pt: 2,
                            }}
                        >
                            <IconButton
                                color="primary"
                                aria-label="close"
                                onClick={toggleDrawer(anchor, false)}
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                            >
                                <CloseOutlinedIcon />
                            </IconButton>
                            {list(anchor)}

                        </Box>

                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}

