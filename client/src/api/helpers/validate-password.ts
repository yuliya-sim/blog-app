

export const validateInput = (
    name: 'email' | 'password',
    value: string,
    errors: {
        email: boolean;
        password: boolean;
    },
    setErrors: React.Dispatch<React.SetStateAction<{
        email: boolean;
        password: boolean;
    }>>,
): void => {
    let errorMessage = '';
    if (name === 'password') {
        if (value.length < 8) {
            errorMessage = 'Password must be at least 8 characters long';
        } else if (!/[a-z]/.test(value)) {
            errorMessage = 'Password must contain at least one lowercase letter';
        } else if (!/[A-Z]/.test(value)) {
            errorMessage = 'Password must contain at least one uppercase letter';
        } else if (!/\d/.test(value)) {
            errorMessage = 'Password must contain at least one number';
        }
    } else {
        if (!/\S+@\S+\.\S+/.test(value)) {
            errorMessage = 'Please enter a valid email';
        }
    }
    setErrors({ ...errors, [name]: errorMessage });
};
