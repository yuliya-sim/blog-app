export interface Post {
    id: string;
    isActive: boolean;
    isArchived: boolean;
    createdAt: Date;
    createdBy: string | null;
    lastChangedDateTime: Date;
    lastChangedBy: string | null;
    internalComment: string | null;
    title: string;
    content: string;
}
