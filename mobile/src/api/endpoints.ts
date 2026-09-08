export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        LOGOUT: '/auth/logout',
        FORGOT_PASSWORD: '/password/forgot',
        RESET_PASSWORD: '/password/reset',
        ME: '/auth/me',
        UPDATE_PASSWORD: '/auth/password/update',
        GOOGLE_LOGIN: '/auth/google-login',
    },
} as const;