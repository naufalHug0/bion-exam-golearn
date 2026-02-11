import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import useAuthStore from '../context/useAuthStore';
import { Button, GameCard } from '../components/GameUI';
import { Gamepad2 } from 'lucide-react';
import toast from 'react-hot-toast'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await API.post('/auth/login', form);
        login(res.data.data);
        toast.success('Login berhasil!');
        navigate('/');
        } catch (err) {
        toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decoration Circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full opacity-50 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-sand rounded-full opacity-50 blur-xl"></div>

        <GameCard className="w-full max-w-md bg-cream z-10 border-4 border-dark">
            <div className="text-center mb-6">
            <div className="inline-block p-4 bg-primary rounded-full mb-3 border-4 border-dark text-white">
                <Gamepad2 size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-primary">GoLearn</h1>
            <p className="text-gray-600 font-medium">Ready to play & learn?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-bold mb-1">Email</label>
                <input 
                type="email" 
                className="w-full p-3 rounded-xl border-2 border-sand focus:border-primary focus:outline-none font-bold text-dark"
                onChange={e => setForm({...form, email: e.target.value})}
                required
                />
            </div>
            <div>
                <label className="block font-bold mb-1">Password</label>
                <input 
                type="password" 
                className="w-full p-3 rounded-xl border-2 border-sand focus:border-primary focus:outline-none font-bold text-dark"
                onChange={e => setForm({...form, password: e.target.value})}
                required
                />
            </div>
            <Button type="submit" className="w-full text-lg mt-4">START GAME</Button>
            </form>
            <div className="mt-4 text-center text-sm font-bold text-gray-500">
            Belum punya akun? <Link to="/register" className="text-primary hover:underline">Daftar disini</Link>
            </div>
        </GameCard>
        </div>
    );
}