import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import useAuthStore from '../context/useAuthStore';
import { Button, GameCard } from '../components/GameUI';
import { Gamepad2 } from 'lucide-react';
import toast from 'react-hot-toast'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        const res = await API.post('/auth/register', form);
        
        login(res.data.data);
        toast.success('Registrasi berhasil! Selamat datang di GoLearn.');
        navigate('/');
        } catch (err) {
        toast.error(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
        
        <div className="absolute top-10 right-10 w-32 h-32 bg-secondary rounded-full opacity-50 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-sand rounded-full opacity-50 blur-xl"></div>

        <GameCard className="w-full max-w-md bg-cream z-10 border-4 border-dark">
            <div className="text-center mb-6">
            <div className="inline-block p-4 bg-primary rounded-full mb-3 border-4 border-dark text-white shadow-game">
                <Gamepad2 size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-primary">Buat Akun</h1>
            <p className="text-gray-600 font-bold">Mulai petualangan belajarmu!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-black mb-1 text-dark">Nama Lengkap</label>
                <input 
                type="text" 
                className="w-full p-3 rounded-xl border-2 border-sand focus:border-primary focus:outline-none font-bold text-dark"
                placeholder="Siswa Teladan"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
                />
            </div>
            <div>
                <label className="block font-black mb-1 text-dark">Email</label>
                <input 
                type="email" 
                className="w-full p-3 rounded-xl border-2 border-sand focus:border-primary focus:outline-none font-bold text-dark"
                placeholder="siswa@golearn.id"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                />
            </div>
            <div>
                <label className="block font-black mb-1 text-dark">Password</label>
                <input 
                type="password" 
                className="w-full p-3 rounded-xl border-2 border-sand focus:border-primary focus:outline-none font-bold text-dark"
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
                />
            </div>
            <Button type="submit" className="w-full text-lg mt-6" disabled={loading}>
                {loading ? 'MEMPROSES...' : 'DAFTAR SEKARANG'}
            </Button>
            </form>
            <div className="mt-6 text-center text-sm font-bold text-gray-500">
            Sudah punya akun? <Link to="/login" className="text-primary hover:text-red-700 underline underline-offset-2">Login disini</Link>
            </div>
        </GameCard>
        </div>
    );
}