import React, { useState } from 'react';
import API_BASE_URL from '../../config';
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
            const response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
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
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={16} className="text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400">AI-Powered Analysis</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Resume Analytics
                        </h1>
                        <p className="text-base text-slate-400 max-w-xl">
                            Upload your resume and the target job description to get instant feedback on compatibility, missing keywords, and ATS friendliness.
                        </p>
                    </div>
                </div>

                {!analysis ? (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Input Section */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                <label className="text-sm font-semibold text-slate-300 block mb-4">1. Upload Resume (PDF)</label>
                                <div className={`relative group border-2 border-dashed rounded-xl p-8 transition-all ${resume ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className="flex flex-col items-center justify-center text-center relative z-10">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${resume ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-base font-semibold text-white mb-1">
                                            {resume ? resume.name : 'Drop your resume here'}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {resume ? `${(resume.size / 1024).toFixed(1)} KB` : 'or click to browse'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                <label className="text-sm font-semibold text-slate-300 block mb-4">2. Job Description</label>
                                <textarea 
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the target job description here..."
                                    className="w-full h-48 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all resize-none text-sm"
                                />
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3 text-sm"
                                >
                                    <AlertCircle size={18} />
                                    {error}
                                </motion.div>
                            )}

                            <button 
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="group w-full h-14 bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 text-sm shadow-lg shadow-fuchsia-500/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} fill="currentColor" />
                                        Analyze Resume
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.div>

                        {/* Tips Section */}
                        <motion.div variants={itemVariants} className="space-y-6 lg:mt-0">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <Sparkles size={24} className="mb-4 text-fuchsia-400" />
                                <h2 className="text-lg font-bold mb-3 text-white">Why run an AI analysis?</h2>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                    Modern recruiters use Applicant Tracking Systems (ATS) to filter candidates. Our tool helps you bypass these filters by optimizing your resume for the specific job.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        'Identify missing keywords',
                                        'Check ATS compatibility',
                                        'Verify skill match',
                                        'Improve shortlisting chances'
                                    ].map((tip, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                            <CheckCircle size={16} className="text-emerald-500" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <h3 className="text-sm font-semibold text-slate-300 mb-4">What we check</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Shield, label: 'ATS Format', color: 'emerald' },
                                        { icon: Search, label: 'Keywords', color: 'cyan' },
                                        { icon: Target, label: 'Match %', color: 'amber' },
                                        { icon: TrendingUp, label: 'Suggestions', color: 'rose' }
                                    ].map((cap, i) => (
                                        <div key={i} className="p-3 bg-slate-900 border border-white/5 rounded-xl flex items-center gap-3">
                                            <cap.icon size={16} className={`text-${cap.color}-400`} />
                                            <span className="text-xs font-medium text-slate-300">{cap.label}</span>
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Shield size={20} className="text-emerald-500" />
                                    Analysis Results
                                </h2>
                                <button 
                                    onClick={() => setAnalysis(null)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-all w-fit"
                                >
                                    New Analysis
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <ScoreCard title="Role Compatibility" score={analysis.matchScore} icon={Zap} color="emerald" />
                                <ScoreCard title="ATS Friendliness" score={analysis.atsCompatibility} icon={Shield} color="cyan" />
                                <ScoreCard title="Keyword Saturation" score={Math.min(100, (analysis.keywordMatching.found.length / Math.max(1, analysis.keywordMatching.found.length + analysis.keywordMatching.missing.length)) * 100)} icon={Search} color="fuchsia" />
                                <ScoreCard title="Shortlist Prob." score={analysis.interviewProbability} icon={Target} color="amber" />
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Left Column: Keyword & Skills */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                            <Search size={18} className="text-cyan-400" />
                                            Keyword Analysis
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 block mb-3">Found in Resume</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.keywordMatching.found.map((word, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">{word}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 block mb-3">Missing Keywords</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.keywordMatching.missing.map((word, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium">{word}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                            <Brain size={18} className="text-fuchsia-400" />
                                            Skills Assessment
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-400 block mb-3">Technical Skills</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.skillAnalysis.technical.map((skill, i) => (
                                                            <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 text-slate-200 border border-white/10 text-xs font-medium">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-400 block mb-3">Soft Skills</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.skillAnalysis.soft.map((skill, i) => (
                                                            <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 text-slate-200 border border-white/10 text-xs font-medium">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {analysis.skillAnalysis.missing.length > 0 && (
                                                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                                                    <label className="text-xs font-semibold text-rose-400 block mb-3">Skill Gaps Detected</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.skillAnalysis.missing.map((skill, i) => (
                                                            <span key={i} className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-3">Project Quality</h3>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            {analysis.projectQuality}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Insights & Strengths */}
                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-sm font-semibold text-emerald-400 mb-4">Strengths</h3>
                                        <ul className="space-y-3">
                                            {analysis.strengths.map((str, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-slate-300">{str}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-sm font-semibold text-rose-400 mb-4">Areas to Improve</h3>
                                        <ul className="space-y-3">
                                            {analysis.weakAreas.map((weak, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-slate-300">{weak}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-sm font-semibold text-fuchsia-400 mb-4">Feedback & Suggestions</h3>
                                        <p className="text-sm text-slate-300 leading-relaxed mb-4 pb-4 border-b border-white/10">
                                            {analysis.recruiterInsights}
                                        </p>
                                        <ul className="space-y-3">
                                            {analysis.suggestions.map((sug, i) => (
                                                <li key={i} className="flex gap-2 text-sm text-slate-400">
                                                    <Sparkles size={14} className="text-fuchsia-400 flex-shrink-0 mt-0.5" />
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
