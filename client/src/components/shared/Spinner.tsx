import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const spinnerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
}
export default function Spinner() {
    return (
        <Box sx={spinnerStyles}>
            <CircularProgress />
        </Box>
    );
}
