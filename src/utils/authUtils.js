// src/utils/authUtils.js
import axios from 'axios';

export const clearUserData = () => {
    console.log('🔴 Clearing user session data...');
    
    // Clear session-related items only
    const itemsToRemove = [
        'token',
        'userEmail',
        'userName',
        'userData',
        'userId',
        'userProfile',
        // NOTE: We DO NOT clear crypto_history here anymore!
        // Trade history should persist for the user when they log back in
    ];
    
    itemsToRemove.forEach(item => {
        if (localStorage.getItem(item)) {
            localStorage.removeItem(item);
            console.log(`✅ Removed: ${item}`);
        }
    });
    
    // Clear session storage
    sessionStorage.clear();
    
    console.log('✅ Session data cleared, trade history preserved in localStorage cache');
};

export const logout = async (navigate) => {
    console.log('🚪 Logging out...');
    
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await axios.post('https://backend-instacoinpay-1.onrender.com/api/auth/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Backend logout successful');
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearUserData();
        if (navigate) {
            navigate('/login');
        }
    }
};

export const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    return true;
};