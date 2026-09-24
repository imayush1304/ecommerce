import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Dropdown } from 'react-bootstrap';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const getCurrentIcon = () => {
        if (theme === 'light') return <Sun size={18} />;
        if (theme === 'dark') return <Moon size={18} />;
        return <Monitor size={18} />;
    };

    return (
        <Dropdown className="theme-switcher" align="end">
            <Dropdown.Toggle as="button" className="nav-icon-btn border-0 theme-toggle-btn">
                {getCurrentIcon()}
            </Dropdown.Toggle>

            <Dropdown.Menu className="theme-menu shadow-sm">
                <Dropdown.Item 
                    className={`theme-item ${theme === 'light' ? 'active-theme' : ''}`} 
                    onClick={() => setTheme('light')}
                >
                    <Sun size={16} className="me-2" /> Light
                </Dropdown.Item>
                <Dropdown.Item 
                    className={`theme-item ${theme === 'dark' ? 'active-theme' : ''}`} 
                    onClick={() => setTheme('dark')}
                >
                    <Moon size={16} className="me-2" /> Dark
                </Dropdown.Item>
                <Dropdown.Item 
                    className={`theme-item ${theme === 'system' ? 'active-theme' : ''}`} 
                    onClick={() => setTheme('system')}
                >
                    <Monitor size={16} className="me-2" /> System
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
