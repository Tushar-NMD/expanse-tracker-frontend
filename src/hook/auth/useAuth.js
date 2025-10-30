import { useState } from 'react';
import conf from '../../config/index.js';

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const registerUser = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${conf.apiBaseUrl}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            let data;
            
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error('Server returned invalid response');
            }

            if (!data.success) {
                throw new Error(data.message || 'Registration failed');
            }

            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const loginUser = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${conf.apiBaseUrl}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            let data;
            
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error('Server returned invalid response');
            }

            if (!data.success) {
                throw new Error(data.message || 'Login failed');
            }

            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    return {
        loading,
        error,
        registerUser,
        loginUser,
    };
};

export default useAuth;