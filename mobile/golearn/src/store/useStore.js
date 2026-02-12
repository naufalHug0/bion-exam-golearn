import { create } from 'zustand';

export const useAlertStore = create((set) => ({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    buttonText: 'OKE',
    onConfirm: null,
    
    showAlert: ({ title, message, type = 'info', buttonText = 'OKE', onConfirm = null }) => 
        set({ visible: true, title, message, type, buttonText, onConfirm }),
        
    hideAlert: () => 
        set({ visible: false, onConfirm: null }),
}));