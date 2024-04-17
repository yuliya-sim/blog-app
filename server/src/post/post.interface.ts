

export interface PostsBySlugResponse {
    title: string;
    posts?: PostDataInterface[];
    blog_content?: string;
    blog_id?: string;
}
export interface PostDataInterface {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    comments: {
        id: string;
        content: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
        };
    }[];
}
