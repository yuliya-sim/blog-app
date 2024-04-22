import { styled } from '@mui/material/styles';

export const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    appBar: {
        position: 'absolute',
        top: 0
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(900 + theme.spacing(6))]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    mainContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`,
    },
    cardHeader: {
        backgroundColor: theme.palette.grey[200],
    },
    cardPricing: {
        display: 'flex',

        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(6),
    },
    cardActions: {
        [theme.breakpoints.up('sm')]: {
            paddingBottom: theme.spacing(2),
        },
    },
    footer: {
        marginTop: theme.spacing(8),
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: `${theme.spacing(6)}px 0`,
    },
    toolbar: {
        display: 'flex',
        gap: '1rem',
    },
});

export const Img = styled('img')({
    margin: 'auto',
    display: 'flex',
    maxWidth: '100%',
    maxHeight: '100%'

});

export const blogCard = {
    p: 2,
    marginBottom: '48px',
    maxWidth: 1200,
    flexGrow: 1,
    backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
}
