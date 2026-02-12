import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const api = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('user_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const getFileUrl = (path) => {
    return `${process.env.EXPO_PUBLIC_API_URL}/${path}`
};

export default api