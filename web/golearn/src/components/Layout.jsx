import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { Home, User, LogOut, BookMarked, Trophy } from 'lucide-react';

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
        <div className="min-h-screen pb-24 md:pb-0 md:pl-24">
        {/* Desktop Sidebar / Mobile Bottom Bar */}
        <nav className="fixed z-50 bg-white border-t-4 md:border-t-0 md:border-r-4 border-sand 
            bottom-0 w-full h-20 md:top-0 md:left-0 md:w-24 md:h-full 
            flex md:flex-col justify-around md:justify-start md:pt-10 items-center shadow-game">
            
            <div className="hidden md:block mb-10 text-primary font-black text-xl">GL</div>

            <NavItem to="/" icon={Home} label="HOME" />
            <NavItem to="/profile" icon={User} label="PROFILE" />
            
            <div className="hidden md:flex flex-col items-center mt-auto mb-10 gap-4">
            <button onClick={logout} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                <LogOut size={24} />
            </button>
            </div>
        </nav>

        {/* Top Header Mobile */}
        <header className="md:hidden flex justify-between items-center p-4 bg-white sticky top-0 z-40 border-b-2 border-sand">
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {user?.name?.[0]}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400">Level 1</p>
                <p className="text-sm font-black text-dark">{user?.name}</p>
            </div>
            </div>
            <div className="flex items-center gap-2 bg-sand/30 px-3 py-1 rounded-full border border-sand">
            <Trophy size={16} className="text-yellow-600 fill-yellow-600" />
            <span className="font-black text-sm">{user?.xp || 0} XP</span>
            </div>
        </header>

        {/* Desktop Header Info */}
        <div className="hidden md:flex absolute top-5 right-10 gap-6 items-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-sand shadow-sm">
            <Trophy size={20} className="text-yellow-500 fill-yellow-500" />
            <span className="font-black text-dark">{user?.xp || 0} XP</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="font-black text-dark">{user?.name}</p>
                    <p className="text-xs font-bold text-primary">Siswa Teladan</p>
                </div>
                <div className="w-12 h-12 bg-primary rounded-xl border-2 border-dark flex items-center justify-center text-white text-xl font-bold shadow-game">
                    {user?.name?.[0]}
                </div>
            </div>
        </div>

        <main className="p-4 md:p-10 max-w-7xl mx-auto">
            <Outlet />
        </main>
        </div>
    );
}