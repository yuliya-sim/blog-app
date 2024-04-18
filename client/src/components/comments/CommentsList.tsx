import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';

import { Avatar, Box, Button, ListItemAvatar } from '@material-ui/core';

import { CommentData } from '../../api/types/Comments';
import { calculateTimePassed } from '../../api/helpers/calculate';
import { checkUserFirstLastName } from '../../api/helpers/validate-name-surname';
import { deleteComment } from '../../api/helpers/delete-comment';
import { listProps } from './styles';

export function CommentsList({ props }) {
    return (
        <Box sx={{ width: '100%' }} role="presentation" >
            {props && props.length > 0 ? (
                props?.map((data: CommentData) => (
                    <List {...listProps(data)}>
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
                ))
            ) : null}
        </Box >
    )

}

