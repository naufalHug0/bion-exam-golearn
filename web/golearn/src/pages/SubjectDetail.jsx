import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { GameCard, XPBar } from '../components/GameUI';
import { CheckCircle, PlayCircle, BookOpen, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

export default function SubjectDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [activeGrade, setActiveGrade] = useState('10'); // Default kelas 10
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubject = async () => {
        try {
            const res = await API.get(`/subjects/${id}`);
            setData(res.data.data);
            setActiveGrade(res.data.data.grade);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchSubject();
    }, [id]);

    if (loading) {
        return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-8 border-sand border-t-primary rounded-full animate-spin mb-4"></div>
            <div className="font-black text-xl text-primary animate-pulse">Memuat Peta Level...</div>
        </div>
        );
    }

    if (!data) {
        return (
        <div className="text-center font-bold p-10 bg-white rounded-3xl border-4 border-dark shadow-game">
            Data pelajaran tidak ditemukan.
            <br/><br/>
            <Link to="/" className="text-primary hover:underline">Kembali ke Home</Link>
        </div>
        );
    }

    const grades = data.grades;

    return (
        <div>
        <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="flex items-center gap-2 p-2 bg-white rounded-xl border-2 border-sand shadow-sm font-black text-gray-500 hover:text-primary hover:border-primary transition-colors">
            <ArrowLeft size={20} /> MAP
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-dark">{data.subject.title}</h1>
        </div>

        {/* Grade Selector (Tabs) */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 custom-scroll">
            {['10', '11', '12'].map((grade) => grades[grade]?.length > 0 && (
            <button
                key={grade}
                onClick={() => setActiveGrade(grade)}
                className={clsx(
                "px-8 py-3 rounded-2xl font-black text-xl border-b-4 transition-all min-w-[120px]",
                // activeGrade === grade 
                    "bg-secondary text-white border-blue-900 shadow-game scale-105" 
                    // : "bg-white text-gray-400 border-sand hover:bg-gray-50 hover:-translate-y-1"
                )}
            >
                KELAS {grade}
            </button>
            ))}
        </div>

        {/* Roadmap Container */}
        <div className="relative max-w-4xl mx-auto space-y-10 pb-20">
            {/* Vertical Line Connector (Visual effect like a skill tree) */}
            <div className="absolute left-8 top-10 bottom-10 w-3 bg-sand -z-10 rounded-full border-x-2 border-gray-200"></div>

            {grades[activeGrade]?.length === 0 ? (
                <div className="text-center p-12 font-black text-xl text-gray-400 bg-white rounded-3xl border-4 border-dashed border-sand">
                    🔒 Belum ada quest di kelas ini!
                </div>
            ) : (
                grades[activeGrade]?.map((chapter, idx) => (
                    <div key={chapter._id} className="relative flex flex-col md:flex-row gap-6 md:items-start group">
                        {/* Node Circle */}
                        <div className={clsx(
                            "w-16 h-16 rounded-full border-4 flex items-center justify-center shrink-0 z-10 font-black text-2xl shadow-game transition-transform group-hover:scale-110 ml-0 md:ml-0",
                            chapter.progress === 100 ? "bg-green-500 border-green-800 text-white" : 
                            chapter.progress > 0 ? "bg-primary border-red-900 text-white" : "bg-white border-sand text-gray-400"
                        )}>
                            {idx + 1}
                        </div>

                        {/* Content Card */}
                        <GameCard className="flex-1 ml-16 md:ml-0 -mt-16 md:mt-0">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 border-b-2 border-sand pb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-dark leading-tight">{chapter.title}</h3>
                                    <p className="text-sm font-bold text-secondary mt-1">{chapter.materials?.length || 0} Materi Tersedia</p>
                                </div>
                                <div className="w-full md:w-32">
                                    <XPBar progress={chapter.progress || 0} label="Progress Bab" color="bg-green-400" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {chapter.materials?.length === 0 && <p className="text-sm font-bold text-gray-400 italic">Materi belum diupload.</p>}
                                
                                {chapter.materials?.map((mat) => (
                                    <Link 
                                        to={`/material/${mat._id}`} 
                                        // PENTING: Passing seluruh data context ke halaman MaterialView agar fitur Bookmark bisa menyimpan info lengkap!
                                        state={{ 
                                        chapterId: chapter._id, 
                                        materialData: mat,
                                        chapterData: chapter,
                                        subjectData: data.subject
                                        }} 
                                        key={mat._id}
                                        className={clsx(
                                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all group",
                                        mat.isCompleted 
                                            ? "bg-green-50 border-green-200 hover:bg-green-100" 
                                            : "bg-cream border-sand hover:border-primary hover:shadow-game-hover hover:-translate-y-1"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={clsx("p-2 rounded-xl border-2 bg-white", mat.isCompleted ? "text-green-500 border-green-200" : "text-primary border-sand")}>
                                                {mat.type === 'video' ? <PlayCircle size={24} /> : <BookOpen size={24} />}
                                            </div>
                                            <div>
                                            <span className={clsx("font-black text-lg block", mat.isCompleted ? "text-green-700 line-through opacity-70" : "text-dark group-hover:text-primary")}>
                                                {mat.title}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{mat.type}</span>
                                            </div>
                                        </div>
                                        {mat.isCompleted && <CheckCircle size={28} className="text-green-500 hidden sm:block" />}
                                    </Link>
                                ))}
                            </div>
                        </GameCard>
                    </div>
                ))
            )}
        </div>
        </div>
    );
}