import {createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext();

export function ThemeProvider({ children}) {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const systemPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initalTheme = savedTheme === 'dark' || (savedTheme === 'system' && systemPreferDark) ? 'dark' : 'light';
        setTheme(initalTheme);
        document.documentElement.setAttribute('data-theme', initalTheme);
    }, []);
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };
    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}
export function useTheme() {
    return useContext(ThemeContext);
}