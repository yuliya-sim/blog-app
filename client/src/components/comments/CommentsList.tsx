import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';

import { Avatar, Box, Button, ListItemAvatar } from '@material-ui/core';

import { CommentData } from '../../api/types/Comments';
import { calculateTimePassed } from '../../api/helpers/caclulate-time';
import { checkUserFirstLastName } from '../../api/helpers/validate-name-surname';
import { deleteComment } from '../../api/helpers/delete-comment';


export function CommentsList({ props }) {
    return (
        <Box sx={{ width: '100%' }} role="presentation" >
            {props?.map((data: CommentData) => (
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} key={data.id} className='authors-comments'>
                    <div >
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar
                                    alt={checkUserFirstLastName(data)}
                                    src={`${data.user.avatarUrl || '/static/images/avatar/1.jpg'}`} />
                            </ListItemAvatar>
                            <ListItemText primary={checkUserFirstLastName(data) && (
                                <div className='author'>
                                    <div> {checkUserFirstLastName(data)} </div>
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
    )

}

