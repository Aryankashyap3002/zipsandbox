// fetchHelper.js
const fetchWithConfig = async (url, options = {}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, config);
    
    if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
    
    return response.json();
};

export default fetchWithConfig;