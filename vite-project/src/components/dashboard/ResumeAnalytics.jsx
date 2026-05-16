import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Upload, 
    FileText, 
    Briefcase, 
    Zap, 
    Target, 
    CheckCircle, 
    AlertCircle, 
    TrendingUp, 
    Brain, 
    Search,
    Shield,
    Sparkles,
    Loader2,
    ArrowRight
} from 'lucide-react';

const ResumeAnalytics = () => {
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setResume(file);
            setError('');
        } else {
            setError('Please upload a valid PDF resume.');
        }
    };

    const handleAnalyze = async () => {
        if (!resume || !jobDescription) {
            setError('Please provide both your resume and a job description.');
            return;
        }

        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('jobDescription', jobDescription);

        try {
            const response = await fetch('http://localhost:5001/api/resume/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            setError('Failed to analyze resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const ScoreCard = ({ title, score, icon: Icon, color }) => (
        <motion.div 
            variants={itemVariants}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-${color}-500/20 transition-all duration-500`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 ring-1 ring-${color}-500/30`}>
                    <Icon size={24} />
                </div>
                <div className={`text-3xl font-black text-${color}-400`}>{score}%</div>
            </div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest relative z-10">{title}</h3>
            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden relative z-10">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r from-${color}-600 to-${color}-400 shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                />
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-10 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('data:image/svg+xml,%3Csvg+viewBox%3D%220+0+200+200%22+xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter+id%3D%22noiseFilter%22%3E%3CfeTurbulence+type%3D%22fractalNoise%22+baseFrequency%3D%220.65%22+numOctaves%3D%223%22+stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect+width%3D%22100%25%22+height%3D%22100%25%22+filter%3D%22url%28%23noiseFilter%29%22%2F%3E%3C%2Fsvg%3E')] opacity-[0.03] brightness-150" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">AI Neural Engine Active</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
                            RESUME <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-emerald-400 to-cyan-400">ANALYTICS</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl font-medium">
                            Upload your resume and the target job description. Our AI will perform a deep audit of your compatibility and provide strategic optimization insights.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Processing Model</div>
                            <div className="text-white font-bold flex items-center gap-2">
                                <Brain size={16} className="text-fuchsia-400" />
                                Llama 3.3 70B
                            </div>
                        </div>
                    </div>
                </div>

                {!analysis ? (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Input Section */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                <label className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 block mb-6">1. Upload Resume (PDF)</label>
                                <div className={`relative group border-2 border-dashed rounded-3xl p-10 transition-all ${resume ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className="flex flex-col items-center justify-center text-center relative z-10">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${resume ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 group-hover:scale-110 group-hover:text-white'}`}>
                                            <Upload size={32} />
                                        </div>
                                        <p className="text-lg font-bold text-white mb-1">
                                            {resume ? resume.name : 'Drop your resume here'}
                                        </p>
                                        <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                                            {resume ? `${(resume.size / 1024).toFixed(1)} KB` : 'or click to browse'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                <label className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 block mb-6">2. Job Description</label>
                                <textarea 
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the target job description here for a precision audit..."
                                    className="w-full h-64 bg-slate-950/50 border border-white/10 rounded-3xl p-6 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none font-medium"
                                />
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 flex items-center gap-3 font-bold text-sm uppercase tracking-wider"
                                >
                                    <AlertCircle size={20} />
                                    {error}
                                </motion.div>
                            )}

                            <button 
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="group w-full h-16 bg-white text-slate-950 font-black rounded-[1.5rem] flex items-center justify-center gap-4 transition-all hover:bg-slate-200 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-sm shadow-2xl shadow-white/10"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Neural Synthesis in Progress...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={20} fill="currentColor" />
                                        Initiate Deep Audit
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.div>

                        {/* Tips Section */}
                        <motion.div variants={itemVariants} className="space-y-6 lg:mt-0">
                            <div className="p-8 bg-gradient-to-br from-fuchsia-600 to-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-fuchsia-500/20">
                                <Sparkles size={32} className="mb-6" />
                                <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Why run an AI audit?</h2>
                                <p className="text-white/80 font-medium leading-relaxed mb-8">
                                    Modern recruiters use AI to filter 90% of candidates before a human even sees the resume. Our engine reverse-engineers these filters to help you bypass the "automated rejection" phase.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Identify hidden keyword requirements',
                                        'Audit ATS parsing compatibility',
                                        'Verify skill-to-role relevance',
                                        'Assess shortlisting probability'
                                    ].map((tip, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
                                            <CheckCircle size={16} />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Platform Capabilities</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Shield, label: 'ATS Secure', color: 'emerald' },
                                        { icon: Search, label: 'Keyword Scan', color: 'cyan' },
                                        { icon: Target, label: 'Shortlist %', color: 'amber' },
                                        { icon: TrendingUp, label: 'Growth Plan', color: 'rose' }
                                    ].map((cap, i) => (
                                        <div key={i} className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex flex-col items-center text-center gap-3">
                                            <cap.icon size={20} className={`text-${cap.color}-400`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{cap.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    /* Results Section */
                    <AnimatePresence>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <button 
                                    onClick={() => setAnalysis(null)}
                                    className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                                >
                                    New Analysis
                                </button>
                                <div className="h-px flex-grow bg-white/5" />
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                    <Shield size={12} />
                                    Audit Complete
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <ScoreCard title="Role Compatibility" score={analysis.matchScore} icon={Zap} color="emerald" />
                                <ScoreCard title="ATS Friendliness" score={analysis.atsCompatibility} icon={Shield} color="cyan" />
                                <ScoreCard title="Keyword Saturation" score={Math.min(100, (analysis.keywordMatching.found.length / Math.max(1, analysis.keywordMatching.found.length + analysis.keywordMatching.missing.length)) * 100)} icon={Search} color="fuchsia" />
                                <ScoreCard title="Shortlist Prob." score={analysis.interviewProbability} icon={Target} color="amber" />
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Left Column: Keyword & Skills */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                                                    <Search size={20} />
                                                </div>
                                                Keyword Analysis
                                            </h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-4">Found in Resume</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.keywordMatching.found.map((word, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold uppercase tracking-wider">{word}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest block mb-4">Missing Keywords</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.keywordMatching.missing.map((word, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold uppercase tracking-wider">{word}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
                                                    <Brain size={20} />
                                                </div>
                                                Skill Proficiency Matrix
                                            </h3>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Technical Skills Identified</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.skillAnalysis.technical.map((skill, i) => (
                                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-200 border border-white/10 text-[11px] font-bold uppercase tracking-wider">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Soft Skills Identified</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.skillAnalysis.soft.map((skill, i) => (
                                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-200 border border-white/10 text-[11px] font-bold uppercase tracking-wider">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-3xl">
                                                <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest block mb-4">Critical Skill Gaps Detected</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.skillAnalysis.missing.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-black uppercase tracking-wider">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Project Quality Audit</h3>
                                        <p className="text-slate-300 font-medium leading-relaxed italic">
                                            "{analysis.projectQuality}"
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Insights & Strengths */}
                                <div className="space-y-8">
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8">
                                        <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-6">Resume Strengths</h3>
                                        <ul className="space-y-4">
                                            {analysis.strengths.map((str, i) => (
                                                <li key={i} className="flex gap-3">
                                                    <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                                                    <span className="text-sm font-bold text-slate-200">{str}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8">
                                        <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-6">Improvement Vectors</h3>
                                        <ul className="space-y-4">
                                            {analysis.weakAreas.map((weak, i) => (
                                                <li key={i} className="flex gap-3">
                                                    <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />
                                                    <span className="text-sm font-bold text-slate-200">{weak}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                        <h3 className="text-sm font-black text-fuchsia-400 uppercase tracking-widest mb-6">Recruiter Insights</h3>
                                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl mb-6">
                                            <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                                                {analysis.recruiterInsights}
                                            </p>
                                        </div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Neural Strategy Suggestions</label>
                                        <ul className="space-y-3">
                                            {analysis.suggestions.map((sug, i) => (
                                                <li key={i} className="flex gap-3 text-xs font-bold text-slate-400">
                                                    <Sparkles size={14} className="text-fuchsia-400 flex-shrink-0" />
                                                    {sug}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Bottom Gradient Blur */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>
    );
};

export default ResumeAnalytics;
