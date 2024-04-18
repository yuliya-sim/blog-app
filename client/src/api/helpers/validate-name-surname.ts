import { CommentData } from "../types/Comments";

export const checkUserFirstLastName = (data: CommentData) => {
    return (
        (data.user.firstName || '') + ' ' +
        (data.user.lastName || '') || ''
    );

}
