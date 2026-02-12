import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API, { getFileUrl } from '../services/api';
import useAuthStore from '../context/useAuthStore';
import { Button, GameCard } from '../components/GameUI';
import { Download, Bookmark, MessageSquare, ArrowLeft, BookOpen } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';

export default function MaterialView() {
    const { id } = useParams(); 
    const { state } = useLocation(); 
    const navigate = useNavigate();
    const { updateUser } = useAuthStore();
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [completed, setCompleted] = useState(false);

    
    const activeMaterial = state?.materialData;
    const chapterId = state?.chapterId;

    useEffect(() => {
        if (!activeMaterial) return;
        
        
        if (activeMaterial.isCompleted) {
            setCompleted(true);
        }

        fetchBookmarkStatus();
        if (chapterId) {
            fetchComments(chapterId);
        }
    }, [id, activeMaterial, chapterId]);

    const fetchBookmarkStatus = async () => {
        try {
            const res = await API.get('/interactions/bookmark');
            const found = res.data.data.find(b => b.material._id === id);
            setIsBookmarked(!!found);
        } catch (err) {
            console.error("Gagal mengambil status bookmark", err);
        }
    };

    const fetchComments = async (chapId) => {
        try {
            const res = await API.get(`/interactions/comment/${chapId}`);
            setComments(res.data.data);
        } catch (err) {
            console.error("Gagal mengambil komentar", err);
        }
    };

    const handleComplete = async () => {
        if (completed) return; 

        try {
            const res = await API.post('/interactions/progress', { materialId: id });
            setCompleted(true);
            
            
            if(res.data.data?.xpGained > 0) {
                toast.success(`LEVEL UP! +${res.data.data.xpGained} XP`, {
                    icon: "🏆",
                    style: { background: "#BF4646", color: "#fff", fontWeight: "bold", border: "2px solid #2D2424", borderRadius: "12px" }
                });
                
                updateUser({ xp: res.data.data.currentXp });
            } else {
                toast.info("Materi selesai di-review ulang.");
            }
        } catch (err) { 
            toast.error("Gagal memperbarui progress.");
        }
    };

    const handleBookmark = async () => {
        try {
            await API.post('/interactions/bookmark', { materialId: id });
            setIsBookmarked(!isBookmarked);
            if (!isBookmarked) {
                toast.success("Tersimpan di Inventory!", { icon: "🎒" });
            } else {
                toast.info("Dihapus dari Inventory");
            }
        } catch (err) {
            toast.error("Gagal mengubah bookmark.");
        }
    };
    
    const handlePostComment = async (e) => {
        e.preventDefault();
        if(!newComment.trim()) return;
        
        try {
            await API.post('/interactions/comment', { chapterId, content: newComment });
            setNewComment('');
            fetchComments(chapterId); 
            toast.success("+5 XP Discussion!", { 
                icon: "💬",
                style: { background: "#7EACB5", color: "#fff", fontWeight: "bold" }
            });
            
            
            
            updateUser({ xp: (useAuthStore.getState().user.xp || 0) + 5 });
        } catch (err) {
            toast.error("Gagal mengirim pesan.");
        }
    };

    
    if (!activeMaterial) {
        return (
            <div className="p-10 text-center bg-white rounded-3xl border-4 border-dark shadow-game max-w-lg mx-auto mt-20">
                <h2 className="text-2xl font-black text-primary mb-4">Akses Ilegal!</h2>
                <p className="font-bold text-gray-500 mb-6">Data materi tidak ditemukan. Harap akses materi melalui Peta Petualangan (Home).</p>
                <Button onClick={() => navigate('/')} className="w-full">KEMBALI KE HOME</Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-20">
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
        
        <div className="lg:col-span-2 space-y-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-sand shadow-sm font-black text-dark hover:bg-sand transition">
                <ArrowLeft size={20}/> Kembali
            </button>
            
            <div className="bg-dark rounded-3xl overflow-hidden shadow-game border-4 border-dark w-full aspect-video relative flex items-center justify-center group">
                {activeMaterial.type === 'video' ? (
                    <video 
                        src={getFileUrl(activeMaterial.contentUrl)} 
                        controls 
                        controlsList="nodownload" 
                        className="w-full h-full object-contain bg-black"
                        onEnded={handleComplete} 
                    />
                ) : activeMaterial.type === 'pdf' ? (
                    <iframe 
                        src={getFileUrl(activeMaterial.contentUrl)} 
                        className="w-full h-full min-h-[500px] bg-white" 
                        title="PDF Viewer"
                    />
                ) : (
                    
                    <div className="text-center text-white p-10 flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-secondary to-blue-900">
                        <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm border-2 border-white/30 mb-6">
                            <BookOpen size={64} className="text-white drop-shadow-md" />
                        </div>
                        <p className="font-black text-3xl mb-2 drop-shadow-md">Slide Presentasi</p>
                        <p className="mb-8 font-bold opacity-80 max-w-md text-center">Browser tidak mendukung preview interaktif untuk format PPT/PPTX secara native.</p>
                        {activeMaterial.isDownloadable && (
                            <a href={getFileUrl(activeMaterial.contentUrl)} download className="inline-block bg-primary border-b-4 border-red-900 active:border-b-0 active:translate-y-1 px-8 py-4 rounded-2xl text-white font-black hover:bg-red-600 transition shadow-lg flex items-center gap-2">
                                <Download size={24} /> UNDUH MATERI UNTUK DIBACA
                            </a>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-3xl border-4 border-sand shadow-game">
                <div className='lg:max-w-[50%]'>
                    <h1 className="text-2xl md:text-3xl font-black text-dark leading-tight">{activeMaterial.title}</h1>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider flex items-center gap-2">
                        <span className="bg-sand px-2 py-1 rounded-md text-dark">{activeMaterial.type}</span>
                        {state?.subjectData && <span>• {state.subjectData.title}</span>}
                    </p>
                </div>
                <div className="flex gap-3 lg:max-w-[50%]">
                    <button 
                        onClick={handleBookmark} 
                        title="Simpan Materi"
                        className={clsx(
                            "p-4 rounded-2xl border-4 transition-all flex items-center justify-center",
                            isBookmarked 
                                ? "bg-yellow-400 border-yellow-600 text-white shadow-game active:translate-y-1 active:shadow-none" 
                                : "bg-white border-sand text-gray-400 hover:bg-sand active:translate-y-1 active:shadow-none"
                        )}
                    >
                        <Bookmark fill={isBookmarked ? "currentColor" : "none"} size={24} />
                    </button>
                    
                    {activeMaterial.isDownloadable && (
                        <a 
                            href={getFileUrl(activeMaterial.contentUrl)} 
                            download 
                            title="Unduh File"
                            className="p-4 rounded-2xl border-4 border-sand bg-white hover:bg-sand text-primary transition-all shadow-game active:translate-y-1 active:shadow-none flex items-center justify-center"
                        >
                            <Download size={24} />
                        </a>
                    )}

                    <Button 
                        onClick={handleComplete} 
                        variant={completed ? "secondary" : "primary"}
                        className="flex-1 md:flex-none py-4 text-lg border-4 shadow-game"
                        disabled={completed}
                    >
                        {completed ? "SELESAI ✔" : "TANDAI SELESAI"}
                    </Button>
                </div>
            </div>
        </div>

        <div className="h-full">
            <GameCard className="h-[600px] lg:h-full flex flex-col border-4 border-sand">
                <div className="flex items-center gap-3 pb-4 border-b-4 border-sand mb-4">
                    <div className="bg-secondary p-2 rounded-xl text-white">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-xl leading-none">Forum Kelas</h3>
                        <p className="text-xs font-bold text-gray-400 mt-1">Tanya & Jawab (+5 XP)</p>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scroll">
                    {comments.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <MessageSquare size={48} className="mb-2" />
                            <p className="text-center text-sm font-bold">Jadilah yang pertama berkomentar!</p>
                        </div>
                    )}
                    {comments.map((c) => (
                        <div key={c._id} className="bg-cream p-4 rounded-2xl border-2 border-sand relative">
                            <div className="absolute top-4 -left-2 w-4 h-4 bg-cream border-l-2 border-b-2 border-sand rotate-45"></div>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm text-white font-black border-2 border-dark shadow-sm">
                                    {c.userId?.name?.[0] || '?'}
                                </div>
                                <div>
                                    <span className="font-black text-sm block leading-none">{c.userId?.name || 'Siswa'}</span>
                                    <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-md mt-1 inline-block border border-yellow-200">
                                        {c.userId?.xp || 0} XP
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-dark whitespace-pre-wrap">{c.content}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={handlePostComment} className="mt-auto pt-4 border-t-4 border-sand">
                    <textarea 
                        className="w-full p-3 bg-white rounded-xl border-4 border-sand focus:border-secondary focus:outline-none text-sm font-bold resize-none transition-colors"
                        rows="3"
                        placeholder="Tulis pertanyaan atau diskusi..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                    />
                    <Button 
                        type="submit" 
                        className="w-full mt-3 text-sm py-3 border-4" 
                        variant="secondary"
                        disabled={!newComment.trim()}
                    >
                        KIRIM PESAN
                    </Button>
                </form>
            </GameCard>
        </div>
        </div>
    );
}