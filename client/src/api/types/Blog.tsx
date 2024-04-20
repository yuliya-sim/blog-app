

export interface Blog {
    isActive: boolean;
    isArchived: boolean;
    createdAt: string;
    createdBy: string;
    internalComment: string;
    title: string;
    slug: string,
    content: string,
    publish_at: string
}
export interface HeaderProps {
    sections: ReadonlyArray<{
        title: string;
        url: string;
    }>;
    title: string;
    blog_id: string
}
