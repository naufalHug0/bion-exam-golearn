import { useEffect, useState } from 'react';
import API from '../services/api';
import useAuthStore from '../context/useAuthStore';
import { Button, GameCard } from '../components/GameUI';
import { BookMarked, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useAuthStore();
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        API.get('/interactions/bookmark').then(res => setBookmarks(res.data.data));
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 mt-20">
        {/* Profile Card */}
        <div className="bg-primary rounded-3xl p-8 text-white shadow-game border-4 border-dark flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="w-32 h-32 bg-white rounded-full border-4 border-sand flex items-center justify-center text-primary text-6xl font-black shadow-lg">
            {user?.name?.[0]}
            </div>
            
            <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-3xl font-black mb-1">{user?.name}</h2>
            <p className="font-bold opacity-80 mb-4">{user?.email}</p>
            <div className="inline-flex bg-dark/20 px-4 py-2 rounded-xl border border-white/20">
                <span className="font-black text-yellow-300 text-xl">{user?.xp} XP Points</span>
            </div>
            </div>

            <div className="flex flex-col gap-2 z-10 w-full md:w-auto">
            <button onClick={logout} className="bg-red-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-900 transition">Logout</button>
            </div>
        </div>

        {/* Bookmarks */}
        <div>
            <h3 className="text-2xl font-black text-dark mb-4 flex items-center gap-2">
                <BookMarked /> My Inventory (Bookmarks)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.length === 0 && <p className="text-gray-400 font-bold">Inventory kosong.</p>}
                {bookmarks.map((b) => (
                    <Link 
                        key={b.bookmarkId} 
                        to={`/material/${b.material._id}`}
                        state={{ chapterId: b.chapter?._id, materialData: b.material }}
                        className="block"
                    >
                        <GameCard className="hover:bg-cream transition cursor-pointer flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-white font-bold">
                                {b.material.type === 'video' ? 'VID' : 'DOC'}
                            </div>
                            <div>
                                <h4 className="font-black text-dark">{b.material.title}</h4>
                                <p className="text-xs font-bold text-gray-400">
                                    {b.subject?.title} • {b.chapter?.title}
                                </p>
                            </div>
                        </GameCard>
                    </Link>
                ))}
            </div>
        </div>
        </div>
    );
}