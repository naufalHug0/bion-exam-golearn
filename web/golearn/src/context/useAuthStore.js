import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
        user: null,
        token: null,
        login: (data) => set({ user: data, token: data.token }),
        logout: () => set({ user: null, token: null }),
        updateUser: (updates) => set((state) => ({ 
            user: { ...state.user, ...updates } 
        })),
        }),
        { name: 'user_storage' }
    )
);

export default useAuthStore;