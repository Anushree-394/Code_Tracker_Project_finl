import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Zap,
    Clock,
    Target,
    Trophy,
    AlertCircle,
    ChevronRight,
    RotateCcw,
    Home,
    BrainCircuit,
    Database,
    Network,
    Code,
    Cpu,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Loader2,
    Activity
} from 'lucide-react';

const RapidFire = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('setup'); // 'setup', 'quiz', 'results'
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        topic: 'Mixed',
        difficulty: 'Adaptive',
        questionCount: 10
    });
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]); // To track user's answers for feedback
    const [isTimeWarning, setIsTimeWarning] = useState(false);
    const [questions, setQuestions] = useState([]);
    const timerRef = useRef(null);

    const topics = [
        { id: 'DSA', name: 'Data Structures', icon: <Code size={20} /> },
        { id: 'DBMS', name: 'Database Management', icon: <Database size={20} /> },
        { id: 'OS', name: 'Operating Systems', icon: <Cpu size={20} /> },
        { id: 'CN', name: 'Computer Networks', icon: <Network size={20} /> },
        { id: 'OOPS', name: 'Object Oriented Programming', icon: <BrainCircuit size={20} /> },
        { id: 'Mixed', name: 'Mixed Bag', icon: <Zap size={20} /> },
    ];

    const questionCounts = [5, 10, 15, 20];

    const startQuiz = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/interview/generate-rapid-fire-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: config.topic,
                    difficulty: config.difficulty,
                    count: config.questionCount
                })
            });

            if (!response.ok) throw new Error('Failed to generate questions');

            const data = await response.json();

            if (data.questions && data.questions.length > 0) {
                setQuestions(data.questions);
                setGameState('quiz');
                setCurrentQuestionIdx(0);
                setScore(0);
                setSelectedAnswer(null);
                setAnswers([]);
                setTimer(10);
                setIsTimeWarning(false);
            } else {
                alert("AI could not generate questions at this moment. Please try again.");
            }
        } catch (err) {
            console.error('Quiz Generation Error:', err);
            alert("Connection error. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (gameState === 'quiz' && timer >= 0 && !loading) {
            if (timer <= 3) setIsTimeWarning(true);
            else setIsTimeWarning(false);

            if (timer === 0) {
                const timeoutId = setTimeout(() => {
                    handleNext();
                }, 1000);
                return () => clearTimeout(timeoutId);
            }

            timerRef.current = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState, timer, loading]);

    const handleNext = () => {
        // Stop any current interval
        clearInterval(timerRef.current);

        const currentQ = questions[currentQuestionIdx];
        const isCorrect = selectedAnswer === currentQ.correct;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setAnswers(prev => [...prev, {
            q: currentQ.question,
            correct: currentQ.correct,
            selected: selectedAnswer
        }]);

        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedAnswer(null);
            setTimer(10); // Reset timer for next question
            setIsTimeWarning(false);
        } else {
            setGameState('results');
        }
    };

    const formatTime = (seconds) => {
        return seconds < 0 ? "0" : seconds.toString();
    };

    const getPerformanceFeedback = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 90) return { title: "Elite Expert", msg: "Outstanding! You've mastered these concepts even under pressure.", color: "text-emerald-400" };
        if (percentage >= 70) return { title: "Strong Candidate", msg: "Great job! Fast fingers and solid fundamentals.", color: "text-cyan-400" };
        if (percentage >= 50) return { title: "Competent", msg: "Good effort. 10 seconds is tough, but you held your own.", color: "text-amber-400" };
        return { title: "Aspiring Developer", msg: "Speed is a skill! Keep practicing these rounds to build muscle memory.", color: "text-rose-400" };
    };

    return (
        <div className="min-h-screen bg-[#050608] text-slate-200 selection:bg-amber-500/30 font-light tracking-wide overflow-x-hidden">
            {/* Background Sophistication */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-150" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header Section */}
                <header className="flex items-center justify-between mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <button
                        onClick={() => navigate('/dashboard/resources/interview')}
                        className="group flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white transition-all hover:bg-white/[0.08] backdrop-blur-md"
                    >
                        <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Dashboard</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Rapid Fire</h1>
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Adaptive Intelligence</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Zap className="text-black" size={24} fill="currentColor" />
                        </div>
                    </div>
                </header>

                {loading && (
                    <div className="min-h-[500px] flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.05] rounded-[3rem] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-500 shadow-2xl">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-amber-500/20 blur-[50px] rounded-full animate-pulse" />
                            <div className="relative h-24 w-24 flex items-center justify-center">
                                <Loader2 size={48} className="text-amber-500 animate-spin relative z-10" />
                                <div className="absolute inset-0 border-t-2 border-amber-500/30 rounded-full animate-ping" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-3">Syncing Neural Bank</h2>
                        <div className="flex items-center gap-3">
                            <div className="h-1 w-12 bg-amber-500/20 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 animate-[loading_2s_infinite]" />
                            </div>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-[10px]">
                                Generating {config.topic} Protocol
                            </p>
                            <div className="h-1 w-12 bg-amber-500/20 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 animate-[loading_2s_infinite]" />
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'setup' && !loading && (
                    <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Main Interaction Hub */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white/[0.02] border border-white/[0.08] rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.02] rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-amber-500/[0.05]" />

                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-12 w-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                                        <Target size={24} className="text-amber-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Configuration</h2>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">Define session parameters</p>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    {/* Topic Selection */}
                                    <div>
                                        <div className="flex items-center justify-between mb-6 px-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Select Discipline</label>
                                            <span className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest">{config.topic} Selected</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {topics.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setConfig(prev => ({ ...prev, topic: t.id }))}
                                                    className={`group relative flex flex-col items-start gap-4 p-6 rounded-[2rem] border transition-all duration-500 ${config.topic === t.id
                                                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/5 border-amber-500/40 shadow-xl shadow-amber-500/5'
                                                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.05]'
                                                        }`}
                                                >
                                                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${config.topic === t.id
                                                        ? 'bg-amber-500 text-black rotate-3 shadow-lg shadow-amber-500/20'
                                                        : 'bg-white/[0.05] text-slate-400 group-hover:scale-110'
                                                        }`}>
                                                        {t.icon}
                                                    </div>
                                                    <span className={`text-[13px] font-bold uppercase tracking-wider transition-colors ${config.topic === t.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                                        {t.name}
                                                    </span>
                                                    {config.topic === t.id && (
                                                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Question Count */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 mb-6 px-1 uppercase tracking-[0.2em]">Load Capacity</label>
                                        <div className="flex flex-wrap gap-4">
                                            {questionCounts.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setConfig(prev => ({ ...prev, questionCount: c }))}
                                                    className={`h-14 w-20 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 border ${config.questionCount === c
                                                        ? 'bg-amber-500 border-amber-400 text-black scale-110 shadow-lg shadow-amber-500/20'
                                                        : 'bg-white/[0.03] border-white/[0.08] text-slate-500 hover:text-white hover:border-white/[0.2]'
                                                        }`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                            <div className="flex-1 flex items-center ml-4 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Total questions in this burst session</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={startQuiz}
                                    className="mt-10 w-full h-16 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-[1px] group active:scale-[0.98] transition-all overflow-hidden shadow-2xl shadow-orange-500/10"
                                >
                                    <div className="w-full h-full bg-[#050608] group-hover:bg-transparent rounded-2xl flex items-center justify-center gap-3 transition-all duration-500">
                                        <span className="text-base font-black text-white group-hover:text-black uppercase tracking-[0.2em]">Initiate Burst</span>
                                        <ArrowRight size={20} className="text-amber-500 group-hover:text-black group-hover:translate-x-2 transition-all duration-500" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Analytics */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white/[0.02] border border-white/[0.08] rounded-[3rem] p-8 backdrop-blur-3xl space-y-8 h-full">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/[0.05] pb-4">Session Dynamics</h3>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-5 group">
                                        <div className="h-14 w-14 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Response Window</div>
                                            <div className="text-xl font-black text-white tracking-tighter">10 SECONDS</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 group">
                                        <div className="h-14 w-14 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                                            <BrainCircuit size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Architecture</div>
                                            <div className="text-xl font-black text-white tracking-tighter">ADAPTIVE AI</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 group">
                                        <div className="h-14 w-14 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                            <Trophy size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Performance</div>
                                            <div className="text-xl font-black text-white tracking-tighter">BADGE TIERED</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] mt-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <AlertCircle size={16} className="text-amber-500/40" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Warning</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                        High-speed knowledge retrieval active. Accuracy decreases as response time expires. Composure is measured.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'quiz' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        {/* Status Bar */}
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Progress Cycle</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-black text-white tracking-tighter">{currentQuestionIdx + 1}</span>
                                                <span className="h-6 w-[1px] bg-white/10 rotate-12" />
                                                <span className="text-lg font-bold text-slate-500">{questions.length}</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-[1px] bg-white/10 mx-2" />
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Adaptive Intelligence Active</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Neural Clock</span>
                                        <div className={`flex items-center gap-3 text-3xl font-black tracking-tighter transition-all duration-300 ${timer <= 3 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`}>
                                            <Clock size={28} />
                                            {formatTime(timer)}s
                                        </div>
                                    </div>
                                </div>

                                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-linear ${timer <= 3 ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                                        style={{ width: `${(timer / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Question Interface */}
                        <div className={`relative min-h-[400px] rounded-[3.5rem] border p-12 backdrop-blur-3xl transition-all duration-500 shadow-2xl ${timer <= 3 ? 'border-rose-500/30 bg-rose-500/[0.02]' : 'border-white/[0.08] bg-white/[0.02]'}`}>
                            {timer <= 3 && (
                                <div className="absolute inset-x-0 top-0 h-1 bg-rose-500/20 animate-pulse rounded-t-full" />
                            )}

                            <h3 className="text-3xl font-bold text-white tracking-tight leading-tight mb-16">
                                {questions[currentQuestionIdx].question}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {questions[currentQuestionIdx].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedAnswer(idx)}
                                        className={`group relative flex items-center gap-5 p-6 rounded-3xl border transition-all duration-300 overflow-hidden ${selectedAnswer === idx
                                            ? 'bg-white text-black border-white shadow-xl shadow-white/10'
                                            : 'bg-white/[0.03] border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.06]'
                                            }`}
                                    >
                                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-black transition-all ${selectedAnswer === idx
                                            ? 'bg-black text-white'
                                            : 'bg-white/[0.05] text-slate-500 group-hover:text-slate-200'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={`text-base font-bold tracking-tight text-left ${selectedAnswer === idx ? 'text-black' : 'text-slate-300 group-hover:text-white'}`}>
                                            {option}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-16 flex items-center justify-between border-t border-white/[0.05] pt-10">
                                <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                    <AlertCircle size={14} className="text-amber-500/50" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Immutable Answer Policy Active</span>
                                </div>
                                <button
                                    onClick={handleNext}
                                    disabled={selectedAnswer === null}
                                    className={`group flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${selectedAnswer !== null
                                        ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-xl shadow-white/10'
                                        : 'bg-white/[0.02] text-slate-700 cursor-not-allowed border border-white/[0.05]'
                                        }`}
                                >
                                    {currentQuestionIdx === questions.length - 1 ? 'Verify Session' : 'Continue Sequence'}
                                    <ArrowRight size={18} className={selectedAnswer !== null ? 'group-hover:translate-x-1 transition-transform' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'results' && (
                    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-8 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-amber-500/[0.03] to-transparent -mt-80 blur-[100px] pointer-events-none" />

                            <div className="relative z-10 text-center space-y-10">
                                <div className="inline-flex flex-col items-center">
                                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-[1px] shadow-2xl shadow-orange-500/20">
                                        <div className="h-full w-full bg-[#050608] rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-amber-500/[0.02] animate-pulse" />
                                            <span className="text-4xl font-black text-white tracking-tighter leading-none">{score}</span>
                                            <div className="flex items-center gap-2 text-slate-500 mt-2">
                                                <div className="h-[1px] w-6 bg-slate-800" />
                                                <span className="text-xs font-black uppercase tracking-widest">{questions.length}</span>
                                                <div className="h-[1px] w-6 bg-slate-800" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-center gap-3 px-6 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full">
                                        <Activity size={12} className="text-amber-500" />
                                        <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Composure Verified</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className={`text-4xl font-black tracking-tighter uppercase leading-none ${getPerformanceFeedback().title === "Elite Expert" ? "text-emerald-400" : getPerformanceFeedback().color}`}>
                                        {getPerformanceFeedback().title}
                                    </h2>
                                    <p className="text-base text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
                                        "{getPerformanceFeedback().msg}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                                    <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-3xl group hover:bg-white/[0.04] transition-all">
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Accuracy</div>
                                        <div className="text-xl font-black text-white tracking-tighter">{Math.round((score / questions.length) * 100)}%</div>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-3xl group hover:bg-white/[0.04] transition-all">
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Topic</div>
                                        <div className="text-xl font-black text-white tracking-tighter">{config.topic}</div>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-3xl group hover:bg-white/[0.04] transition-all">
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Time</div>
                                        <div className="text-xl font-black text-white tracking-tighter">{questions.length * 10}S</div>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-3xl group hover:bg-white/[0.04] transition-all">
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Badge</div>
                                        <div className={`text-xl font-black tracking-tighter ${getPerformanceFeedback().color}`}>MASTER</div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
                                    <button
                                        onClick={() => setGameState('setup')}
                                        className="w-full sm:w-auto px-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={14} />
                                        Reset Sequence
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/resources/interview')}
                                        className="w-full sm:w-auto px-6 py-3 bg-white rounded-xl text-[9px] font-black text-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                                    >
                                        <Home size={14} />
                                        Archive Results
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Audit Breakdown */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-10">Neural Audit Trail</h3>
                            <div className="grid gap-4">
                                {answers.map((item, idx) => (
                                    <div key={idx} className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:border-white/[0.15] transition-all">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-4">
                                                <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-[10px] font-black text-white">
                                                    {idx + 1}
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.selected === item.correct ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                                    {item.selected === item.correct ? 'Verified' : 'Fault Detected'}
                                                </div>
                                            </div>
                                            <p className="text-xl font-bold text-white tracking-tight">{item.q}</p>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-3xl min-w-[240px] flex flex-col gap-2">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Master Protocol Definition:</span>
                                            <p className="text-emerald-400 font-bold tracking-tight">
                                                {questions[idx].options[item.correct]}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
};

export default RapidFire;
