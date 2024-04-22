import { User } from "../types/Comments";

export const checkUserFirstLastName = (data: User) => {
    return (
        (data && data.firstName ? data.firstName : '') + ' ' +
        (data && data.lastName ? data.lastName : '')
    );
}
