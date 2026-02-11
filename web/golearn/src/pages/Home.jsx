import { useEffect, useState } from 'react';
import API, { getFileUrl } from '../services/api';
import { GameCard, Button, XPBar } from '../components/GameUI';
import { Search, Grid, List, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [subjects, setSubjects] = useState([]);
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    const fetchSubjects = async () => {
        try {
        const res = await API.get(`/subjects?keyword=${search}&category=${filter}`);
        setSubjects(res.data.data);
        } catch (err) {
        console.error(err);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [search, filter]);

    return (
        <div>
        {/* Header Controls */}
        <div className="mb-8">
            <h1 className="text-4xl font-black text-primary mb-2">Adventure Map</h1>
            <p className="font-bold text-gray-400">Pilih quest pelajaranmu hari ini!</p>
            
            <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input 
                type="text" 
                placeholder="Cari pelajaran..." 
                className="w-full pl-10 p-3 rounded-2xl border-2 border-sand focus:border-primary focus:outline-none font-bold"
                value={search}
                onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <button onClick={() => setView('grid')} className={`p-3 rounded-xl border-2 ${view === 'grid' ? 'bg-primary text-white border-primary' : 'bg-white border-sand'}`}><Grid /></button>
                <button onClick={() => setView('list')} className={`p-3 rounded-xl border-2 ${view === 'list' ? 'bg-primary text-white border-primary' : 'bg-white border-sand'}`}><List /></button>
            </div>
            </div>
        </div>

        {/* Grid Subjects */}
        <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {subjects.map((sub) => (
            <GameCard key={sub._id} className="hover:-translate-y-2 transition-transform duration-300">
                <div className="h-40 bg-sand rounded-xl mb-4 overflow-hidden relative border-2 border-sand">
                {sub.thumbnail ? (
                    <img src={getFileUrl(sub.thumbnail)} alt={sub.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-white font-black text-4xl">
                    {sub.title[0]}
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg text-xs font-black border border-dark">
                    Kelas {sub.grade}
                </div>
                </div>
                
                <h3 className="text-xl font-black text-dark mb-2">{sub.title}</h3>
                <div className="mb-4">
                <XPBar progress={sub.progress || 0} label="Progress" color="bg-primary" />
                </div>
                
                <Link to={`/subject/${sub._id}`}>
                <Button className="w-full">
                    <Play size={18} fill="currentColor" /> MAIN
                </Button>
                </Link>
            </GameCard>
            ))}
        </div>
        </div>
    );
}