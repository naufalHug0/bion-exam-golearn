import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { Home, User, LogOut, Trophy, Crown } from 'lucide-react'; 

export default function Layout() {
    const { user, logout } = useAuthStore();
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
        <Link to={to} className={`flex flex-col items-center p-2 rounded-xl transition-all ${active ? 'text-primary scale-110' : 'text-gray-400 hover:text-secondary'}`}>
            <Icon size={24} strokeWidth={3} />
            <span className="text-[10px] font-bold mt-1">{label}</span>
        </Link>
        );
    };

    return (
        <div className="min-h-screen pb-24 md:pb-0 md:pl-24 relative">
        <nav className="fixed z-50 bg-white border-t-4 md:border-t-0 md:border-r-4 border-sand 
            bottom-0 w-full h-20 md:top-0 md:left-0 md:w-24 md:h-full 
            flex md:flex-col justify-around md:justify-start md:pt-10 items-center shadow-game">
            
            <div className="hidden md:block mb-10 text-primary font-black text-xl bg-sand/30 p-2 rounded-xl border-2 border-sand">GL</div>

            <NavItem to="/" icon={Home} label="HOME" />
            <NavItem to="/leaderboard" icon={Crown} label="RANK" /> 
            <NavItem to="/profile" icon={User} label="PROFILE" />
            
            <div className="hidden md:flex flex-col items-center mt-auto mb-10 gap-4">
            <button onClick={logout} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl border-2 border-transparent hover:border-red-200 transition-all">
                <LogOut size={24} />
            </button>
            </div>
        </nav>

        <header className="md:hidden flex justify-between items-center p-4 bg-white sticky top-0 z-40 border-b-4 border-sand shadow-sm">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg border-2 border-dark shadow-game">
                {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Player</p>
                <p className="text-sm font-black text-dark leading-none">{user?.name}</p>
            </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-xl border-2 border-yellow-200 shadow-sm">
            <Trophy size={16} className="text-yellow-600 fill-yellow-400" />
            <span className="font-black text-sm text-yellow-700">{user?.xp || 0} XP</span>
            </div>
        </header>

        <div className="hidden md:flex absolute top-6 right-10 gap-6 items-center z-40">
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border-4 border-sand shadow-game transition-transform hover:-translate-y-1">
            <Trophy size={24} className="text-yellow-500 fill-yellow-400" />
            <span className="font-black text-dark text-lg">{user?.xp || 0} XP</span>
            </div>
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border-4 border-sand shadow-game">
                <div className="text-right">
                    <p className="font-black text-dark leading-tight">{user?.name}</p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Siswa Teladan</p>
                </div>
                <div className="w-12 h-12 bg-primary rounded-xl border-2 border-dark flex items-center justify-center text-white text-xl font-black shadow-sm">
                    {user?.name?.[0]?.toUpperCase()}
                </div>
            </div>
        </div>

        <main className="p-4 md:p-10 max-w-7xl mx-auto pt-8 md:pt-32">
            <Outlet />
        </main>
        </div>
    );
}