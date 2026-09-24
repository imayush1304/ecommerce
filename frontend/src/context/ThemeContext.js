import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Check localStorage first, otherwise default to 'light'
    const getInitialTheme = () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedPrefs = window.localStorage.getItem('theme-preference');
            if (typeof storedPrefs === 'string') {
                return storedPrefs;
            }
        }
        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    const applyTheme = (themeName) => {
        const root = window.document.documentElement;
        
        let resolvedTheme = themeName;
        if (themeName === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            resolvedTheme = systemPrefersDark ? 'dark' : 'light';
        }
        
        // Remove old theme classes
        root.classList.remove('light', 'dark');
        
        // Add new theme class & data attribute
        root.classList.add(resolvedTheme);
        root.setAttribute('data-theme', resolvedTheme);
    };

    useEffect(() => {
        applyTheme(theme);
        window.localStorage.setItem('theme-preference', theme);
    }, [theme]);

    // Listen for system changes if the user selected 'system'
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
