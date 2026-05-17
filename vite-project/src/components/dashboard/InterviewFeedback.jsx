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
                const res = await fetch('http://localhost:5001/api/interview/evaluate-answer', {
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

    const scoreNum = parseInt(feedback?.score) || 0;
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400 stroke-emerald-400';
        if (score >= 60) return 'text-amber-400 stroke-amber-400';
        return 'text-rose-400 stroke-rose-400';
    };
    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/20';
        if (score >= 60) return 'from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/20';
        return 'from-rose-500/20 via-rose-500/5 to-transparent border-rose-500/20';
    };

    const circ = 2 * Math.PI * 80;
    const offset = circ - (circ * scoreNum) / 100;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard/resources/interview/stress')}
                    className="group mb-12 inline-flex items-center gap-3 text-slate-500 hover:text-white transition-all"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Simulation</span>
                </button>

                {/* Score Header Widget */}
                <div className={`mb-12 grid md:grid-cols-12 gap-8 items-center bg-gradient-to-br ${getScoreGradient(scoreNum)} border-2 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="md:col-span-4 flex flex-col items-center justify-center relative z-10">
                        <div className="relative h-44 w-44 flex items-center justify-center">
                            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 200 200">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="14"
                                    fill="transparent"
                                    className="text-white/[0.05]"
                                />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="14"
                                    fill="transparent"
                                    strokeDasharray={circ}
                                    strokeDashoffset={offset}
                                    className={`${getScoreColor(scoreNum)} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-black ${getScoreColor(scoreNum).split(' ')[0]}`}>{scoreNum}</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Composure Index</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 space-y-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className={`h-2.5 w-2.5 rounded-full ${scoreNum >= 60 ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Performance Assessment</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                            Simulation <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Results</span>
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed font-medium bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                            {feedback.overallFeedback}
                        </p>
                    </div>
                </div>

                {/* Expert Blueprint / Improved Answer */}
                {feedback.improvedAnswer && (
                    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-indigo-500/30 rounded-[2.5rem] p-8 md:p-10 mb-10 relative overflow-hidden shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-3 text-indigo-400 mb-6 relative z-10">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-inner">
                                <Star size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Expert Blueprint</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recommended Composure Delivery</p>
                            </div>
                        </div>
                        <p className="text-lg md:text-xl text-slate-200 font-semibold leading-relaxed relative z-10 pl-6 border-l-4 border-indigo-500 italic">
                            "{feedback.improvedAnswer}"
                        </p>
                    </div>
                )}

                {/* Feedback Matrix */}
                <div className="grid lg:grid-cols-2 gap-6 mb-10">
                    <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-emerald-500/5">
                        <div className="flex items-center gap-4 text-emerald-400 mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase tracking-[0.2em] text-white">Key Strengths</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Positive Indicators</p>
                            </div>
                        </div>
                        {feedback.strengths && feedback.strengths.length > 0 ? (
                            <ul className="space-y-6">
                                {feedback.strengths.map((s, i) => (
                                    <li key={i} className="flex gap-5 items-start">
                                        <div className="h-7 w-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <p className="text-base text-slate-300 font-medium leading-relaxed">{s}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-emerald-500/20 rounded-3xl">
                                <p className="text-slate-500 italic text-sm text-center">No significant strengths identified <br /> during this simulation session.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-rose-500/5 border-2 border-rose-500/20 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-rose-500/5">
                        <div className="flex items-center gap-4 text-rose-400 mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-inner">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase tracking-[0.2em] text-white">Growth Areas</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vulnerabilities Detected</p>
                            </div>
                        </div>
                        {feedback.weaknesses && feedback.weaknesses.length > 0 ? (
                            <ul className="space-y-6">
                                {feedback.weaknesses.map((w, i) => (
                                    <li key={i} className="flex gap-5 items-start">
                                        <div className="h-7 w-7 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <p className="text-base text-slate-300 font-medium leading-relaxed">{w}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-rose-500/20 rounded-3xl">
                                <p className="text-slate-500 italic text-sm text-center">No major weaknesses detected. <br /> Your composure remained commendable.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Captured Transcript Box */}
                <div className="space-y-6">
                    <div className="bg-slate-900/80 border-2 border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                        <div className="px-8 py-6 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={18} className="text-indigo-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Captured Transcript</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">Scenario Response</span>
                        </div>
                        <div className="p-8 md:p-10">
                            <div className="relative max-w-3xl mx-auto">
                                <span className="absolute -top-6 -left-6 text-7xl text-white/5 font-serif select-none">"</span>
                                <p className="text-xl italic font-medium text-slate-300 leading-relaxed text-center px-6 relative z-10">
                                    {userAnswer}
                                </p>
                                <span className="absolute -bottom-10 -right-6 text-7xl text-white/5 font-serif select-none">"</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-16 flex flex-col items-center">
                    <div className="h-12 w-px bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mb-8" />
                    <button
                        onClick={() => navigate('/dashboard/resources/interview/stress')}
                        className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-600/30 border border-white/10"
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
