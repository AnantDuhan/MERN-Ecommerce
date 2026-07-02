export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        FORGOT_PASSWORD: '/auth/password/forgot',
        RESET_PASSWORD: '/auth/password/reset',
        ME: '/auth/me',
        UPDATE_PASSWORD: '/auth/password/update',
        GOOGLE_LOGIN: '/auth/google-login',
    },
} as const;