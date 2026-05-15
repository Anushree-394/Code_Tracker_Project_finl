import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Target, AlertCircle, CheckCircle, ArrowLeft, Loader2, Star, MessageSquare, ShieldCheck, Activity, Brain } from 'lucide-react';

const InterviewFeedback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { question, role, userAnswer } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!question || !userAnswer) {
            navigate('/dashboard/resources/interview/stress');
            return;
        }

        const fetchFeedback = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/interview/evaluate-answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, role, userAnswer })
                });

                if (!res.ok) throw new Error('Evaluation failed');

                const data = await res.json();
                setFeedback(data);
            } catch (err) {
                console.error(err);
                setError('Evaluation system encountering high latency. Please retry.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [question, userAnswer, role, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
                    <Loader2 size={64} className="text-indigo-500 animate-spin relative z-10" />
                </div>
                <h2 className="text-2xl font-black text-white mt-8 tracking-tighter uppercase">AI Quality Audit</h2>
                <p className="text-slate-500 mt-2 text-center max-w-xs font-medium uppercase tracking-[0.2em] text-[10px]">Quantifying composure and impact metrics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
                <AlertCircle size={48} className="text-rose-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-300 hover:text-white transition-all font-bold uppercase tracking-widest text-xs"
                >
                    Return to Simulation
                </button>
            </div>
        );
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-rose-400';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="group mb-12 inline-flex items-center gap-3 text-slate-500 hover:text-white transition-all"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Simulation</span>
                </button>

                {/* Score Header Widget */}
                <div className="mb-12 grid md:grid-cols-12 gap-6 items-center bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl">
                    <div className="md:col-span-4 flex justify-center">
                        <div className="relative h-40 w-40">
                            <svg className="h-full w-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="85"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-white/5"
                                />
                                <circle
                                    cx="88"
                                    cy="88"
                                    r="78"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={490}
                                    strokeDashoffset={490 - (490 * feedback.score) / 100}
                                    className={`${getScoreColor(feedback.score)} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-black ${getScoreColor(feedback.score)}`}>{feedback.score}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Composure Index</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Post-Simulation Audit</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                            Simulation <br /> <span className="text-slate-500">Results</span>
                        </h1>
                        <p className="text-base text-slate-400 leading-relaxed font-medium">
                            {feedback.overallFeedback}
                        </p>
                    </div>
                </div>

                {/* Feedback Matrix */}
                <div className="grid lg:grid-cols-2 gap-6 mb-10">
                    <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 text-emerald-400 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Key Strengths</h3>
                        </div>
                        {feedback.strengths && feedback.strengths.length > 0 ? (
                            <ul className="space-y-6">
                                {feedback.strengths.map((s, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-slate-300 font-semibold leading-snug">{s}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center py-6">
                                <p className="text-slate-500 italic text-sm text-center">No significant strengths identified <br /> during this simulation session.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-rose-500/5 border-2 border-rose-500/20 rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 text-rose-400 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Growth Areas</h3>
                        </div>
                        {feedback.weaknesses && feedback.weaknesses.length > 0 ? (
                            <ul className="space-y-6">
                                {feedback.weaknesses.map((w, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="h-5 w-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-slate-300 font-semibold leading-snug">{w}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center py-6">
                                <p className="text-slate-500 italic text-sm text-center">No major weaknesses detected. <br /> Your composure remained commendable.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audit Content */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border-2 border-white/5 rounded-[2.5rem] overflow-hidden">
                        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={16} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Captured Transcript</span>
                            </div>
                            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">v1.2 Simulation Engine</span>
                        </div>
                        <div className="p-8">
                            <div className="relative">
                                <span className="absolute -top-5 -left-3 text-5xl text-white/5 font-serif">"</span>
                                <p className="text-lg italic font-medium text-slate-400 leading-relaxed text-center px-4">
                                    {userAnswer}
                                </p>
                                <span className="absolute -bottom-8 -right-3 text-5xl text-white/5 font-serif">"</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-16 flex flex-col items-center">
                    <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mb-6" />
                    <button
                        onClick={() => navigate('/dashboard/resources/interview/stress')}
                        className="px-10 py-4 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-600/20"
                    >
                        Initiate New Assessment
                    </button>
                    <p className="mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Groq Analytics Infrastructure</p>
                </div>
            </div>
        </div>
    );
};

export default InterviewFeedback;
