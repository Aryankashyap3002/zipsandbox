import fetchWithConfig from '@/config/fetchConfig';

export const signUpRequest = async ({ email, password, username }) => {
    try {
        const response = await fetchWithConfig('/api/v1/users/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, username })
        });
        return response;
    } catch(error) {
        console.error(error);
        throw error;
    }
};

export const signInRequest = async ({ email, password }) => {
    try {
        const response = await fetchWithConfig('/api/v1/users/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        return response;
    } catch(error) {
        console.error(error);
        throw error;
    }
};