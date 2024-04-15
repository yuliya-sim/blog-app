
export class MessageResponse<T> {
    message: string;
    user?: Partial<T>;
    post?: Partial<T>;
    blog?: Partial<T>;
    comment?: Partial<T>;
}
