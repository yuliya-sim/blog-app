
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { SubmitComment } from './SubmitComment';
import { commentBoxStyle } from './styles';


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
            <div>
                <TextField
                    id="outlined-content"
                    label="Content"
                    variant="outlined"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <Button type="submit" variant="contained">
                Submit
            </Button>
        </Box>
    );
}
