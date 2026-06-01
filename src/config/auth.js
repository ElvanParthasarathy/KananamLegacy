/**
 * Authentication Configuration
 * 
 * Hardcoded credentials for simple login
 * Session is stored in localStorage
 */

// Credentials (not for production use - for demo only)
export const AUTH_CREDENTIALS = {
    email: 'srijaipriyasilks@gmail.com',
    password: 'kananam@sjs'
};

// LocalStorage key for session
export const AUTH_SESSION_KEY = 'elvan-auth-session';

/**
 * Check if user is logged in
 */
export const isAuthenticated = () => {
    const session = localStorage.getItem(AUTH_SESSION_KEY);
    if (!session) return false;

    try {
        const data = JSON.parse(session);
        return data.isLoggedIn === true;
    } catch {
        return false;
    }
};

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {{ success: boolean, error?: string }}
 */
export const login = (email, password) => {
    if (email === AUTH_CREDENTIALS.email && password === AUTH_CREDENTIALS.password) {
        const session = {
            isLoggedIn: true,
            email: email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
};

/**
 * Get current user info
 */
export const getCurrentUser = () => {
    const session = localStorage.getItem(AUTH_SESSION_KEY);
    if (!session) return null;

    try {
        return JSON.parse(session);
    } catch {
        return null;
    }
};

export default { isAuthenticated, login, logout, getCurrentUser };
