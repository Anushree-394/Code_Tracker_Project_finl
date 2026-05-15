import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Zap,
    Clock,
    Target,
    Trophy,
    AlertCircle,
    RotateCcw,
    Home,
    BrainCircuit,
    FileText,
    Code,
    ArrowRight,
    Loader2,
    Activity,
    CheckCircle2,
    XCircle,
    Info
} from 'lucide-react';

const AptitudeQuiz = () => {
    const { domain } = useParams();
    const navigate = useNavigate();

    const [gameState, setGameState] = useState('setup'); // 'setup', 'quiz', 'results'
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        difficulty: 'Medium',
        questionCount: 10
    });
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30); // 30 seconds for aptitude
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);
    const timerRef = useRef(null);

    const domainInfo = {
        'quantitative': { name: 'Quantitative Mastery', icon: <Zap size={24} />, color: 'amber' },
        'logical': { name: 'Logical Inference', icon: <BrainCircuit size={24} />, color: 'violet' },
        'verbal': { name: 'Verbal Proficiency', icon: <FileText size={24} />, color: 'emerald' },
        'data-interpretation': { name: 'Data Analytics', icon: <Code size={24} />, color: 'cyan' }
    };

    const currentDomain = domainInfo[domain] || { name: 'General Aptitude', icon: <Target size={24} />, color: 'slate' };

    const startQuiz = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/aptitude/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domain: currentDomain.name,
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
                setTimer(domain === 'verbal' ? 20 : 45); // Adjust timer based on domain
                setShowExplanation(false);
            }
        } catch (err) {
            console.error('Aptitude Error:', err);
            alert("Connection error. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (gameState === 'quiz' && timer > 0 && !loading && !showExplanation) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 && !showExplanation) {
            handleNext();
        }
        return () => clearInterval(timerRef.current);
    }, [gameState, timer, loading, showExplanation]);

    const handleNext = () => {
        clearInterval(timerRef.current);
        const currentQ = questions[currentQuestionIdx];
        const isCorrect = selectedAnswer === currentQ.correct;

        if (isCorrect) setScore(prev => prev + 1);

        setAnswers(prev => [...prev, {
            q: currentQ.question,
            correct: currentQ.correct,
            selected: selectedAnswer,
            explanation: currentQ.explanation
        }]);

        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedAnswer(null);
            setTimer(domain === 'verbal' ? 20 : 45);
            setShowExplanation(false);
        } else {
            setGameState('results');
        }
    };

    const formatDomainTitle = (str) => {
        return str.replace('-', ' ').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#050608] text-slate-200 selection:bg-amber-500/30 tracking-wide overflow-x-hidden p-6 md:p-10">
            {/* Background Sophistication */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-${currentDomain.color}-600/5 rounded-full blur-[120px]`} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-150" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate('/dashboard/resources/aptitude')}
                        className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white transition-all backdrop-blur-md"
                    >
                        <Home size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Aptitude Center</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{currentDomain.name}</h1>
                            <p className={`text-[10px] font-bold text-${currentDomain.color}-500 uppercase tracking-[0.3em] mt-1`}>Module Active</p>
                        </div>
                        <div className={`h-10 w-10 rounded-xl bg-${currentDomain.color}-500/20 border border-${currentDomain.color}-500/30 flex items-center justify-center text-${currentDomain.color}-400`}>
                            {currentDomain.icon}
                        </div>
                    </div>
                </header>

                {loading && (
                    <div className="min-h-[400px] flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] backdrop-blur-2xl">
                        <Loader2 size={40} className={`text-${currentDomain.color}-500 animate-spin mb-4`} />
                        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Initializing Domain Data</h2>
                        <p className="text-slate-500 text-xs uppercase tracking-widest mt-2">Connecting to Neural Banks...</p>
                    </div>
                )}

                {gameState === 'setup' && !loading && (
                    <div className="max-w-2xl mx-auto py-12">
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl text-center">
                            <div className={`h-20 w-20 rounded-3xl bg-${currentDomain.color}-500/10 border border-${currentDomain.color}-500/20 flex items-center justify-center mx-auto mb-8 text-${currentDomain.color}-500`}>
                                {React.cloneElement(currentDomain.icon, { size: 40 })}
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">{currentDomain.name}</h2>
                            <p className="text-slate-400 text-sm mb-12 leading-relaxed">
                                This module will test your proficiency in {currentDomain.name.toLowerCase()}.
                                Adaptive scoring is active. Precision and speed are both critical for elite ranking.
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Complexity Tier</label>
                                    <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5">
                                        {['Easy', 'Medium', 'Hard'].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}
                                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${config.difficulty === d ? `bg-${currentDomain.color}-500 text-black shadow-lg` : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Load Count</label>
                                    <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5">
                                        {[5, 10, 20].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setConfig(prev => ({ ...prev, questionCount: c }))}
                                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${config.questionCount === c ? `bg-${currentDomain.color}-500 text-black shadow-lg` : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={startQuiz}
                                className={`w-full py-5 rounded-2xl bg-${currentDomain.color}-500 text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-${currentDomain.color}-500/10 flex items-center justify-center gap-3`}
                            >
                                Initiate Module
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'quiz' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Quiz Header */}
                        <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.08] p-6 rounded-3xl backdrop-blur-xl">
                            <div className="flex gap-8">
                                <div>
                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Position</span>
                                    <div className="text-xl font-bold text-white tracking-tighter">
                                        {currentQuestionIdx + 1} <span className="text-slate-600 font-medium">/</span> {questions.length}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Precision</span>
                                    <div className="text-xl font-bold text-white tracking-tighter">
                                        {Math.round((score / Math.max(1, currentQuestionIdx)) * 100)}%
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Time Remaining</span>
                                <div className={`text-2xl font-black tracking-tighter ${timer <= 5 ? 'text-red-500 animate-pulse' : `text-${currentDomain.color}-400`}`}>
                                    {timer}s
                                </div>
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-3xl min-h-[400px]">
                            <h3 className="text-2xl font-bold text-white leading-relaxed mb-12">
                                {questions[currentQuestionIdx].question}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {questions[currentQuestionIdx].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => !showExplanation && setSelectedAnswer(idx)}
                                        className={`group relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${selectedAnswer === idx
                                            ? `bg-${currentDomain.color}-500 text-black border-${currentDomain.color}-400`
                                            : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'}`}
                                    >
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${selectedAnswer === idx ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-500 group-hover:text-slate-200'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={`text-sm font-semibold text-left ${selectedAnswer === idx ? 'text-black' : 'text-slate-300 group-hover:text-white'}`}>
                                            {opt}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                                    <AlertCircle size={14} className="text-slate-600" />
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Enforced</span>
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={selectedAnswer === null}
                                    className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedAnswer !== null
                                        ? `bg-white text-black hover:scale-105 shadow-xl shadow-white/10`
                                        : 'bg-white/[0.02] text-slate-700 cursor-not-allowed border border-white/5'}`}
                                >
                                    {currentQuestionIdx === questions.length - 1 ? 'End Module' : 'Commit Answer'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'results' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-10 backdrop-blur-3xl text-center">
                            <div className="inline-flex flex-col items-center mb-10">
                                <div className={`h-28 w-28 rounded-3xl bg-gradient-to-tr from-${currentDomain.color}-500 to-${currentDomain.color}-400 p-[1px] shadow-2xl overflow-hidden`}>
                                    <div className="h-full w-full bg-[#050608] rounded-3xl flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-white tracking-tighter">{score}</span>
                                        <div className="h-px w-8 bg-white/10 my-1" />
                                        <span className="text-[10px] font-black text-slate-600 uppercase">{questions.length}</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-2 px-4 py-1 bg-white/[0.03] border border-white/5 rounded-full">
                                    <Activity size={10} className={`text-${currentDomain.color}-400`} />
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Efficiency Verified</span>
                                </div>
                            </div>

                            <h2 className={`text-4xl font-black uppercase tracking-tighter mb-4 text-${currentDomain.color}-400`}>
                                {score / questions.length >= 0.8 ? 'Elite Architect' : score / questions.length >= 0.5 ? 'Specialist' : 'Initiate'}
                            </h2>
                            <p className="text-slate-500 text-sm max-w-md mx-auto mb-10">
                                Performance evaluation complete. Your score reflects your current cognitive throughput in {currentDomain.name.toLowerCase()}.
                            </p>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                                {[
                                    { label: 'Accuracy', val: `${Math.round((score / questions.length) * 100)}%` },
                                    { label: 'Domain', val: domain === 'data-interpretation' ? 'Data' : currentDomain.name.split(' ')[0] },
                                    { label: 'Rank', val: 'Level 4' },
                                    { label: 'Status', val: 'Passed' }
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{s.label}</div>
                                        <div className="text-lg font-black text-white tracking-tighter">{s.val}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => setGameState('setup')}
                                    className="w-full sm:w-auto px-10 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10"
                                >
                                    Re-Initiate
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard/resources/aptitude')}
                                    className="w-full sm:w-auto px-10 py-4 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-black hover:scale-105 active:scale-95 transition-all"
                                >
                                    Return to Hub
                                </button>
                            </div>
                        </div>

                        {/* Audit Detailed Review */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-8">Session Neural Audit</h3>
                            <div className="grid gap-4">
                                {answers.map((ans, idx) => (
                                    <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 group transition-all hover:bg-white/[0.03]">
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                        {idx + 1}
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${ans.selected === ans.correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {ans.selected === ans.correct ? 'Verified' : 'Fault'}
                                                    </div>
                                                </div>
                                                <p className="text-lg font-bold text-white tracking-tight">{ans.q}</p>

                                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                                                    <div className="flex items-center gap-2 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                                                        <Info size={12} /> Explanation
                                                    </div>
                                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                        {ans.explanation || "No advanced protocol data available for this question."}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl min-w-[200px]">
                                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">Protocol Status</span>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-[10px] text-slate-500 block">System Value:</span>
                                                        <span className="text-emerald-400 font-bold text-sm tracking-tight">{questions[idx].options[ans.correct]}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-500 block">User Value:</span>
                                                        <span className={`font-bold text-sm tracking-tight ${ans.selected === ans.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                                                            {ans.selected !== null ? questions[idx].options[ans.selected] : 'TIMEOUT'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AptitudeQuiz;
