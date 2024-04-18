import { CommentData } from "../../api/types/Comments";

export const containerClassName = 'authors-comments';
const listStyle = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
};
export const listProps = (data: CommentData) => ({
    sx: listStyle,
    key: data.id,
    className: containerClassName,
});
export const boxComments = {
    width: { sm: 300, },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pt: 2,
};

export const commentIcon = { position: 'absolute', top: 0, right: 0 };

export const commentBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiTextField-root': {
        m: 1,
        width: '10rem',
    },
}
