import { create } from 'zustand';
import axios from 'axios';


const API_URL = `${import.meta.env.VITE_API_URL}/api`;
 console.log(API_URL)

export const useAuthStore = create((set) => {
    return {
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        isCheckingAuth: true,
        message: null,

        signup: async (email, password, name) => {
            set({ isLoading: true, error: null });

            try {
                const response = await axios.post(`${API_URL}/signup`, { email, password, name }, { withCredentials: true });
                set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            } catch (error) {
                set({ error: error.response.data.message || "Error signing up", isLoading: false });
                throw error;
            }
        },

        login: async (email, password) => {
            set({ isLoading: true, error: null });

            try {
                const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });

                set(
                    {
                        user: response.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
            } catch (error) {
                set({ error: error.response.data.message || "Error logging in", isLoading: false });
                throw error;
            }
        },

        signout: async () => {
            set({ isLoading: true, error: null });

            try {
                const response = await axios.post(`${API_URL}/logout`, {withCredentials:true});

                set(
                    {
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
            } catch (error) {
                set({ error: error.response.data.message || "Error logging out", isLoading: false });
                throw error;
            }
        },

        verifyEmail: async (code) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.post(`${API_URL}/verify-email`, {verificationCode: code}, { withCredentials: true });
                set({ user: response.data.user, isAuthenticated: true, isLoading: false });
                return response.data;
            } catch (error) {
                set({ error: error.response.data.message || "Error verifying email", isLoading: false });
                throw error;
            }

        },

        checkAuth: async () => {
            set({ isCheckingAuth: true, error: null });
            try {
                const response = await axios.get(`${API_URL}/check-auth`, { withCredentials: true });

                set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
            } catch (error) {
                set({ user: null, error: null, isCheckingAuth: false, isAuthenticated: false });
            }
        },

        forgotPassword: async (email) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.post(`${API_URL}/forgot-password`, { email });
                set({ message: response.data.message, isLoading: false });
            } catch (error) {
                set({
                    isLoading: false,
                    error: error.response.data.message || "Error sending reset password email",
                });
                throw error;
            }
        },
        resetPassword: async (token, password) => {
            // console.log('resetPassword Route hit');
            set({ isLoading: true, error: null });
            try {
                const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
                set({ message: response.data.message, isLoading: false });
            } catch (error) {
                set({
                    isLoading: false,
                    error: error.response.data.message || "Error resetting password",
                });
                throw error;
            }
        },



    }
});