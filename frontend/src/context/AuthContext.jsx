import { createContext, useEffect, useState } from 'react';
 
 const AuthContext = createContext();
 
 export const AuthContextProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: null,
        isLoading: true // Remain in loading state until the check is complete
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if(user && token) {
            setAuth({
                user: JSON.parse(user),
                token,
                isLoading: false // Once loading is done, update state
            });
        } else {
            setAuth({
                user: null,
                token: null,
                isLoading: false
            });
        }
    }, []);

    async function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuth({
            user: null,
            token: null,
            isLoading: false // Logout resets the loading state to false
        });
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

 
 export default AuthContext;