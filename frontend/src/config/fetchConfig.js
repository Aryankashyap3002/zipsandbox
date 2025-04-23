const fetchWithConfig = async (url, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Using token:', token); // Log the token being sent

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'x-access-token': token } : {}),
                ...options.headers
            },
            ...options
        };

        const fullUrl = `${import.meta.env.VITE_BACKEND_URL}${url}`;
        console.log('Making request to:', fullUrl);

        const response = await fetch(fullUrl, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};



export default fetchWithConfig;