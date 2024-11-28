import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService, JwtPayload } from '../service/AuthService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: JwtPayload | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    signup: async () => {},
    logout: () => {},
    isAuthenticated: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<JwtPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = AuthService.getCurrentUser();
                if (storedUser && !AuthService.isTokenExpired()) {
                    setUser(storedUser);
                } else {
                    // Token is expired or invalid
                    AuthService.logout();
                    navigate('/login');
                }
            } catch (error) {
                console.error('Authentication initialization error:', error);
                AuthService.logout();
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth().then(r => console.log("Auth initialized: AuthContext.tsx#46", r));
    }, [navigate]);

    const login = async (email: string, password: string) => {
        try {
            const loginResult = await AuthService.login({ email, password });
            if (loginResult) {
                // @ts-ignore
                setUser(loginResult.user);
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const signup = async (username: string, email: string, password: string) => {
        try {
            await AuthService.signup({ username, email, password });
            await login(email, password);
        } catch (error) {
            console.error('Signup failed', error);
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
        navigate('/login');
    };

    // If still loading, return null or a loading indicator
    if (isLoading) {
        return <div>Loading...</div>; // Or a proper loading component
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            isAuthenticated: !!user && !AuthService.isTokenExpired()
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);