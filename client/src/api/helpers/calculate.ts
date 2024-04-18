export const calculateTimePassed = (givenDate: Date) => {
    const dateComment = new Date(givenDate);
    const now = new Date();
    const delta = Math.abs(now - dateComment) / 1000;

    const days = Math.floor(delta / 86400);
    const hours = Math.floor(delta / 3600) % 24;
    const minutes = Math.floor(delta / 60) % 60;

    if (days > 0) {
        return `${days} days ago`;
    } else if (hours > 0) {
        return `${hours} hours ago`;
    } else {
        return `${minutes} minutes ago`;
    }
}
