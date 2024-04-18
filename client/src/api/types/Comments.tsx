export interface User {
    avatarUrl: string;
    firstName: string;
    lastName: string;
}

export interface CommentData {
    id: string;
    createdAt: Date
    content: string;
    user: User;
}
