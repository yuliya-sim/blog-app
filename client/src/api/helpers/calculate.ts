export const calculateTimePassed = (givenDate: Date) => {
    const date = new Date(givenDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}.${month}.${year}`;

}
