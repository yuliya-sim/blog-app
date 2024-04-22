
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { SubmitComment } from './SubmitComment';
import { commentBoxStyle } from './styles';
import { Card, CardContent, Typography, CardActions } from '@mui/material';


export default function CreateComment() {
    const { content, setContent, handleSubmit } = SubmitComment();

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={commentBoxStyle}
            noValidate
            autoComplete="off"
        >
            <Card sx={{ minWidth: 200, minHeight: 200 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        <TextField
                            id="outlined-content"
                            label="Content"
                            variant="outlined"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button type="submit" variant="contained">
                        Submit
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}
