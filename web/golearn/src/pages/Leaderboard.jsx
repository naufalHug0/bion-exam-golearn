import { useEffect, useState } from 'react';
import API from '../services/api';
import { GameCard } from '../components/GameUI';
import { Crown, Medal, Award, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import useAuthStore from '../context/useAuthStore';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore(); 

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get('/interactions/leaderboard');
        setLeaders(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  
  const getRankStyle = (index) => {
    switch(index) {
      case 0: return { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-600', icon: <Crown size={32} className="text-yellow-500 fill-yellow-500" /> }; 
      case 1: return { bg: 'bg-slate-50', border: 'border-slate-400', text: 'text-slate-600', icon: <Medal size={28} className="text-slate-500 fill-slate-300" /> }; 
      case 2: return { bg: 'bg-orange-50', border: 'border-orange-600', text: 'text-orange-700', icon: <Award size={28} className="text-orange-600 fill-orange-400" /> }; 
      default: return { bg: 'bg-white', border: 'border-sand', text: 'text-gray-500', icon: <span className="font-black text-xl">{index + 1}</span> };
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-primary rounded-full mb-4 border-4 border-dark text-white shadow-game">
          <Trophy size={48} className="fill-yellow-400 text-yellow-200" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight">Hall of Fame</h1>
        <p className="font-bold text-gray-500 mt-2 text-lg">Top 5 Pelajar dengan XP Tertinggi!</p>
      </div>

      <div className="space-y-4 relative">
        {loading ? (
            <div className="text-center font-bold text-primary animate-pulse p-10">Memuat Papan Peringkat...</div>
        ) : leaders.length === 0 ? (
            <div className="text-center font-bold text-gray-400 p-10 bg-white rounded-3xl border-4 border-dashed border-sand">Belum ada data.</div>
        ) : (
            leaders.map((leader, index) => {
                const rankStyle = getRankStyle(index);
                const isMe = user?._id === leader._id; 

                return (
                    <GameCard 
                        key={leader._id} 
                        className={clsx(
                            "flex items-center gap-4 transition-transform hover:-translate-y-1",
                            rankStyle.bg, 
                            rankStyle.border,
                            "border-4",
                            isMe && "ring-4 ring-primary ring-offset-4" 
                        )}
                    >
                        <div className={clsx("w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl border-2 bg-white shadow-sm", rankStyle.border, rankStyle.text)}>
                            {rankStyle.icon}
                        </div>

                        <div className="flex-1 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-dark flex items-center justify-center font-black text-white bg-secondary shadow-game text-xl shrink-0 overflow-hidden">
                                {leader.avatar && leader.avatar.startsWith('http') ? (
                                    <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                                ) : (
                                    leader.name[0].toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-dark flex items-center gap-2">
                                    {leader.name}
                                    {isMe && <span className="text-xs bg-primary text-white px-2 py-1 rounded-lg uppercase tracking-wider">You</span>}
                                </h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Peringkat {index + 1}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-black text-2xl md:text-3xl text-dark">
                                {leader.xp || 0}
                            </div>
                            <div className="text-xs font-bold text-yellow-600">XP POINTS</div>
                        </div>
                    </GameCard>
                )
            })
        )}
      </div>
    </div>
  );
}