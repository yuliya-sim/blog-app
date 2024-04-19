export const isTokenExpired = (token: string | null) => {
    try {
        if (!token) {
            return
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));

        if (decodedToken.exp) {

            const expiryTimestamp = decodedToken.exp * 1000;
            const currentTimestamp = Date.now();

            return currentTimestamp >= expiryTimestamp;
        }

        return true;
    } catch (error) {
        return true;
    }
};
