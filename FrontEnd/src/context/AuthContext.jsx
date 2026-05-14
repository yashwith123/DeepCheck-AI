import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [welcome, setWelcome] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("dc_token");
        const storedUser = localStorage.getItem("dc_user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
    }, []);

    const login = ({ token: newToken, username }) => {
        localStorage.setItem("dc_token", newToken);
        localStorage.setItem("dc_user", username);
        setToken(newToken);
        setUser(username);
        setWelcome(`Welcome, ${username.split(" ")[0]} 👋`);
        setTimeout(() => setWelcome(""), 3000);
        // smooth redirect to homepage
        try {
            window.history.pushState({}, "", "/");
        } catch (e) { }
    };

    const logout = () => {
        localStorage.removeItem("dc_token");
        localStorage.removeItem("dc_user");
        setToken(null);
        setUser(null);
        // redirect home
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, welcome }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
