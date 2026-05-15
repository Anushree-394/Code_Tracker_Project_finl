import React, { useState, useEffect, useRef } from 'react';
import { Brain, ArrowLeft, RefreshCw, Loader2, Mic, Square, Send, Terminal, Shield, Cpu, Activity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roles = [
    { id: 'sde', name: 'Software Development Engineer', icon: '💻', color: 'indigo' },
    { id: 'frontend', name: 'Frontend Developer', icon: '🎨', color: 'sky' },
    { id: 'backend', name: 'Backend Developer', icon: '⚙️', color: 'emerald' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: '🚀', color: 'violet' },
    { id: 'data-science', name: 'Data Scientist', icon: '📊', color: 'amber' },
    { id: 'devops', name: 'DevOps Engineer', icon: '♾️', color: 'rose' },
    { id: 'product-manager', name: 'Product Manager', icon: '🗒️', color: 'cyan' },
    { id: 'qa', name: 'QA Engineer', icon: '🔍', color: 'orange' }
];

const QuestionCard = ({ question, index, role, onNavigateFeedback }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const current = event.resultIndex;
                const resultTranscript = event.results[current][0].transcript;
                setTranscript(resultTranscript);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const themes = [
        { border: 'border-indigo-500', bg: 'bg-indigo-500/5', text: 'text-indigo-400', label: 'Critical Situation' },
        { border: 'border-emerald-500', bg: 'bg-emerald-500/5', text: 'text-emerald-400', label: 'Conflict Resolution' },
        { border: 'border-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-400', label: 'High Stakes' },
        { border: 'border-rose-500', bg: 'bg-rose-500/5', text: 'text-rose-400', label: 'System Failure' },
        { border: 'border-cyan-500', bg: 'bg-cyan-500/5', text: 'text-cyan-400', label: 'Ethics & Integrity' }
    ];

    const theme = themes[index % themes.length];

    return (
        <div className={`relative overflow-hidden rounded-2xl border-2 ${theme.border} ${theme.bg} p-6 md:p-8 transition-all hover:shadow-lg hover:shadow-${theme.border.split('-')[1]}-500/10 group`}>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    <div className={`h-14 w-14 rounded-2xl bg-slate-900 border ${theme.border} flex items-center justify-center`}>
                        <Terminal size={24} className={theme.text} />
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 ${theme.text} border ${theme.border}/20`}>
                            {theme.label}
                        </span>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Scenario #{index + 1}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
                        "{question}"
                    </h3>

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={toggleRecording}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border-2 ${isRecording
                                    ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                                    : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {isRecording ? <Square size={16} fill="currentColor" /> : <Mic size={16} />}
                                {isRecording ? 'Listening...' : 'Record Answer'}
                            </button>

                            {transcript && !isRecording && (
                                <button
                                    onClick={() => onNavigateFeedback(question, transcript)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                                >
                                    <Send size={16} />
                                    Submit Answer
                                </button>
                            )}
                        </div>

                        {transcript && (
                            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 block mb-3">Live Transcript</span>
                                <p className="text-slate-300 italic font-medium leading-relaxed text-base">
                                    "{transcript}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StressInterview = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateQuestions = async () => {
        if (!selectedRole) {
            setError('Please select your specialty first.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const roleName = roles.find(r => r.id === selectedRole)?.name || selectedRole;
            const res = await fetch('http://localhost:5000/api/interview/generate-stress-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: roleName }),
            });

            if (!res.ok) throw new Error('API Unavailable');

            const data = await res.json();
            setQuestions(data.questions || []);
        } catch (err) {
            setError('Simulation systems offline. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateFeedback = (question, answer) => {
        const roleName = roles.find(r => r.id === selectedRole)?.name || selectedRole;
        navigate('/dashboard/resources/interview/stress/feedback', {
            state: { question, role: roleName, userAnswer: answer }
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Background elements - colorful but not too glowy */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
                <button
                    onClick={() => navigate('/dashboard/resources/interview')}
                    className="group mb-12 flex items-center gap-3 text-slate-500 hover:text-white transition-all"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/20">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Resources</span>
                </button>

                <div className="mb-16 grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">Live Simulation Mode</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none">
                            AI STRESS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-400">ANALYZER</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-lg font-medium leading-relaxed">
                            Select a role to generate a custom stress interview dossier. Record your vocal responses to test your composure and get instant AI feedback.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl">
                        <div className="mb-6">
                            <label className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 block mb-3">Choose Your Path</label>
                            <div className="grid grid-cols-2 gap-2">
                                {roles.map(role => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${selectedRole === role.id
                                            ? `border-${role.color}-500 bg-${role.color}-500/10 text-white`
                                            : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-2xl">{role.icon}</span>
                                        <span className="text-sm font-bold truncate">{role.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={generateQuestions}
                            disabled={loading}
                            className="w-full h-14 bg-white text-slate-950 font-black rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-slate-200 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-sm shadow-xl shadow-white/5"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                            {loading ? 'Initializing Simulation...' : 'Generate Simulation'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border-2 border-rose-500/20 rounded-xl text-rose-400 text-base font-bold flex items-center gap-4">
                        <Shield size={20} />
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {questions.length > 0 && !loading ? (
                        <>
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-500">Dossier Loaded</h2>
                                <div className="h-px flex-grow bg-white/5" />
                                <RefreshCw
                                    size={16}
                                    className="text-slate-500 cursor-pointer hover:text-white transition-colors"
                                    onClick={generateQuestions}
                                />
                            </div>
                            {questions.map((q, index) => (
                                <QuestionCard
                                    key={index}
                                    question={q}
                                    index={index}
                                    role={roles.find(r => r.id === selectedRole)?.name}
                                    onNavigateFeedback={handleNavigateFeedback}
                                />
                            ))}
                        </>
                    ) : !loading && (
                        <div className="py-24 flex flex-col items-center justify-center border-4 border-dashed border-white/5 rounded-[3rem]">
                            <div className="h-20 w-20 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 rotate-3">
                                <Brain size={48} className="text-slate-700" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-600 uppercase tracking-tighter">System Idle</h3>
                            <p className="text-sm text-slate-700 font-black uppercase tracking-[0.3em] mt-2">Awaiting specialty selection</p>
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Utility classes for dynamic role colors */}
            <div className="hidden border-indigo-500 bg-indigo-500/10 text-indigo-400"></div>
            <div className="hidden border-sky-500 bg-sky-500/10 text-sky-400"></div>
            <div className="hidden border-emerald-500 bg-emerald-500/10 text-emerald-400"></div>
            <div className="hidden border-violet-500 bg-violet-500/10 text-violet-400"></div>
            <div className="hidden border-amber-500 bg-amber-500/10 text-amber-400"></div>
            <div className="hidden border-rose-500 bg-rose-500/10 text-rose-400"></div>
            <div className="hidden border-cyan-500 bg-cyan-500/10 text-cyan-400"></div>
            <div className="hidden border-orange-500 bg-orange-500/10 text-orange-400"></div>
        </div>
    );
};

export default StressInterview;
