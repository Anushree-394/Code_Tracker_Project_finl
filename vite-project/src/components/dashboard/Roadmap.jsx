import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Target, 
    Calendar, 
    Clock, 
    BookOpen, 
    CheckCircle, 
    Loader2, 
    Sparkles, 
    RefreshCw, 
    Zap,
    Map,
    ListTodo,
    Trophy,
    Save,
    FolderGit2,
    Plus
} from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Roadmap = () => {
    // Auth & saved state
    const [user, setUser] = useState(null);
    const [savedRoadmaps, setSavedRoadmaps] = useState([]);
    const [activeRoadmapId, setActiveRoadmapId] = useState(null);
    const [roadmapName, setRoadmapName] = useState('');
    const [saving, setSaving] = useState(false);

    // Form state
    const [goal, setGoal] = useState('');
    const [currentSkills, setCurrentSkills] = useState('');
    const [dailyTime, setDailyTime] = useState('');
    const [deadline, setDeadline] = useState('');
    const [learningStyle, setLearningStyle] = useState('Video-based');
    const [techStack, setTechStack] = useState('');
    const [focusAreas, setFocusAreas] = useState('');
    
    // Status state
    const [loading, setLoading] = useState(false);
    const [adjusting, setAdjusting] = useState(false);
    const [roadmapData, setRoadmapData] = useState(null);
    const [error, setError] = useState('');

    // State for tracking task completion
    const [completedTasks, setCompletedTasks] = useState(new Set());

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchSavedRoadmaps(currentUser.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchSavedRoadmaps = async (userId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/roadmap/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setSavedRoadmaps(data);
            }
        } catch (err) {
            console.error('Failed to fetch roadmaps', err);
        }
    };

    const loadRoadmap = (roadmap) => {
        setGoal(roadmap.goal || '');
        setCurrentSkills(roadmap.currentSkills || '');
        setDailyTime(roadmap.dailyTime || '');
        setDeadline(roadmap.deadline || '');
        setLearningStyle(roadmap.learningStyle || 'Video-based');
        setTechStack(roadmap.techStack || '');
        setFocusAreas(roadmap.focusAreas || '');
        setRoadmapData(roadmap.roadmapData);
        setCompletedTasks(new Set(roadmap.completedTasks || []));
        setActiveRoadmapId(roadmap._id);
        setRoadmapName(roadmap.name);
        setError('');
    };

    const handleNewRoadmap = () => {
        setGoal('');
        setCurrentSkills('');
        setDailyTime('');
        setDeadline('');
        setTechStack('');
        setFocusAreas('');
        setRoadmapData(null);
        setCompletedTasks(new Set());
        setActiveRoadmapId(null);
        setRoadmapName('');
        setError('');
    };

    const handleGenerate = async () => {
        if (!goal || !currentSkills || !dailyTime || !deadline) {
            setError('Please fill in goal, skills, daily time, and deadline.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/roadmap/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal, currentSkills, dailyTime, deadline, learningStyle, techStack, focusAreas })
            });

            if (!response.ok) throw new Error('Failed to generate roadmap');

            const data = await response.json();
            setRoadmapData(data);
            setCompletedTasks(new Set());
            setActiveRoadmapId(null);
            setRoadmapName('');
        } catch (err) {
            setError('Failed to generate your personalized roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user || !roadmapName || !roadmapData) return;
        setSaving(true);
        setError('');

        try {
            const payload = {
                userId: user.uid,
                name: roadmapName,
                goal,
                currentSkills,
                dailyTime,
                deadline,
                learningStyle,
                techStack,
                focusAreas,
                roadmapData,
                completedTasks: Array.from(completedTasks)
            };

            const res = await fetch(`${API_BASE_URL}/api/roadmap/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save roadmap');
            const saved = await res.json();
            setActiveRoadmapId(saved._id);
            fetchSavedRoadmaps(user.uid);
        } catch (err) {
            setError('Failed to save roadmap.');
        } finally {
            setSaving(false);
        }
    };

    const handleAdjust = async () => {
        if (!roadmapData) return;
        
        setAdjusting(true);
        setError('');

        const allTasks = roadmapData.weeklyMilestones.flatMap(m => m.tasks);
        const missedTasksCount = allTasks.length - completedTasks.size;

        try {
            const response = await fetch(`${API_BASE_URL}/api/roadmap/adjust`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    originalGoal: goal,
                    completedTaskCount: completedTasks.size,
                    missedTaskCount: missedTasksCount,
                    currentRoadmap: roadmapData 
                })
            });

            if (!response.ok) throw new Error('Failed to adjust roadmap');

            const data = await response.json();
            setRoadmapData(data);
            setCompletedTasks(new Set());

            // If it's a saved roadmap, update it in DB
            if (activeRoadmapId) {
                await fetch(`${API_BASE_URL}/api/roadmap/${activeRoadmapId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roadmapData: data, completedTasks: [] })
                });
            }
        } catch (err) {
            setError('Failed to adjust your roadmap. Please try again.');
        } finally {
            setAdjusting(false);
        }
    };

    const toggleTask = async (taskId) => {
        const newSet = new Set(completedTasks);
        if (newSet.has(taskId)) {
            newSet.delete(taskId);
        } else {
            newSet.add(taskId);
        }
        setCompletedTasks(newSet);

        // Auto-save progress if it's an active roadmap
        if (activeRoadmapId) {
            try {
                await fetch(`${API_BASE_URL}/api/roadmap/${activeRoadmapId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completedTasks: Array.from(newSet) })
                });
            } catch (err) {
                console.error('Failed to sync progress');
            }
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

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-10 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles size={16} className="text-indigo-400" />
                        <span className="text-sm font-semibold text-indigo-400">AI-Powered Journey Planner</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Roadmap Planner
                    </h1>
                    <p className="text-base text-slate-400 max-w-xl mx-auto mb-8">
                        Tell us your goal and constraints. Our AI will craft a personalized step-by-step learning path, and adapt it as you progress.
                    </p>

                    {/* Saved Roadmaps */}
                    {savedRoadmaps.length > 0 && (
                        <div className="w-full flex flex-col items-center">
                            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                <FolderGit2 size={16} className="text-fuchsia-400" />
                                Your Saved Plans
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {savedRoadmaps.map(rm => (
                                    <button 
                                        key={rm._id}
                                        onClick={() => loadRoadmap(rm)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeRoadmapId === rm._id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        <Map size={14} className={activeRoadmapId === rm._id ? 'text-white' : 'text-indigo-400'} />
                                        {rm.name}
                                    </button>
                                ))}
                                <button 
                                    onClick={handleNewRoadmap}
                                    className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    Create New
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {!roadmapData ? (
                    <motion.div variants={itemVariants} className="w-full max-w-3xl mx-auto">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                                        <Target size={16} className="text-cyan-400" />
                                        What is your primary goal?
                                    </label>
                                    <input 
                                        type="text"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="e.g. Become a Full Stack Developer, Master System Design..."
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                                        <BookOpen size={16} className="text-fuchsia-400" />
                                        What are your current skills?
                                    </label>
                                    <input 
                                        type="text"
                                        value={currentSkills}
                                        onChange={(e) => setCurrentSkills(e.target.value)}
                                        placeholder="e.g. HTML, CSS, basic React..."
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                                            <Clock size={16} className="text-emerald-400" />
                                            Daily time available?
                                        </label>
                                        <input 
                                            type="text"
                                            value={dailyTime}
                                            onChange={(e) => setDailyTime(e.target.value)}
                                            placeholder="e.g. 2 hours"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                                            <Calendar size={16} className="text-amber-400" />
                                            Target deadline?
                                        </label>
                                        <input 
                                            type="text"
                                            value={deadline}
                                            onChange={(e) => setDeadline(e.target.value)}
                                            placeholder="e.g. 3 months"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                                            <BookOpen size={16} className="text-emerald-400" />
                                            Target Tech Stack?
                                        </label>
                                        <input 
                                            type="text"
                                            value={techStack}
                                            onChange={(e) => setTechStack(e.target.value)}
                                            placeholder="e.g. MERN, Python, Next.js"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                                            <Target size={16} className="text-amber-400" />
                                            Specific Weaknesses?
                                        </label>
                                        <input 
                                            type="text"
                                            value={focusAreas}
                                            onChange={(e) => setFocusAreas(e.target.value)}
                                            placeholder="e.g. Algorithms, CSS..."
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                                        <Zap size={16} className="text-fuchsia-400" />
                                        Preferred Learning Style?
                                    </label>
                                    <select 
                                        value={learningStyle}
                                        onChange={(e) => setLearningStyle(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3.5 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all text-sm appearance-none"
                                    >
                                        <option value="Video-based" className="bg-slate-900 text-slate-200">Video-based (YouTube, Courses)</option>
                                        <option value="Documentation" className="bg-slate-900 text-slate-200">Documentation & Reading</option>
                                        <option value="Project-based" className="bg-slate-900 text-slate-200">Project-based (Learning by doing)</option>
                                        <option value="Interactive" className="bg-slate-900 text-slate-200">Interactive (Coding platforms)</option>
                                    </select>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <button 
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="group w-full h-12 mt-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 text-sm shadow-lg shadow-indigo-500/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Synthesizing Roadmap...
                                        </>
                                    ) : (
                                        <>
                                            <Map size={18} fill="currentColor" />
                                            Generate AI Roadmap
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Roadmap Results */
                    <AnimatePresence>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm shadow-xl">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Map size={20} className="text-indigo-400" />
                                        Your Roadmap: {goal}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1">Completion target: {deadline} • Daily effort: {dailyTime}</p>
                                </div>
                                <div className="flex flex-wrap gap-3 items-center">
                                    {!activeRoadmapId && (
                                        <div className="flex items-center gap-2 mr-2">
                                            <input 
                                                type="text"
                                                value={roadmapName}
                                                onChange={(e) => setRoadmapName(e.target.value)}
                                                placeholder="Name this plan..."
                                                className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 w-36 sm:w-48"
                                            />
                                            <button 
                                                onClick={handleSave}
                                                disabled={saving || !roadmapName}
                                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                Save
                                            </button>
                                        </div>
                                    )}

                                    {activeRoadmapId && (
                                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg mr-2">
                                            <CheckCircle size={16} className="text-emerald-400" />
                                            <span className="text-sm font-medium text-emerald-400">Plan Saved</span>
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleAdjust}
                                        disabled={adjusting}
                                        className="px-4 py-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                                    >
                                        {adjusting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                        Adjust
                                    </button>
                                    <button 
                                        onClick={handleNewRoadmap}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Left/Main: Weekly Milestones */}
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Trophy size={18} className="text-amber-400" />
                                        Weekly Milestones & Tasks
                                    </h3>
                                    
                                    {roadmapData.weeklyMilestones.map((week, wIdx) => (
                                        <div key={wIdx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">W{wIdx + 1}</span>
                                                {week.title}
                                            </h4>
                                            <p className="text-sm text-slate-400 mb-6 pl-10">{week.focus}</p>
                                            
                                            <div className="space-y-3 pl-10">
                                                {week.tasks.map((task, tIdx) => {
                                                    const taskId = `w${wIdx}-t${tIdx}`;
                                                    const isCompleted = completedTasks.has(taskId);
                                                    return (
                                                        <div 
                                                            key={taskId}
                                                            onClick={() => toggleTask(taskId)}
                                                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-900/50 border-white/5 hover:border-white/20'}`}
                                                        >
                                                            <div className={`mt-0.5 w-5 h-5 rounded-full border flex flex-shrink-0 items-center justify-center ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-500 text-transparent'}`}>
                                                                <CheckCircle size={14} />
                                                            </div>
                                                            <span className={`text-sm ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                                                {task}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right: Resources & Projects */}
                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                                            <ListTodo size={16} />
                                            Daily Schedule
                                        </h3>
                                        <div className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                            {roadmapData.dailySchedule}
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-sm font-semibold text-fuchsia-400 mb-4 flex items-center gap-2">
                                            <BookOpen size={16} />
                                            Recommended Resources
                                        </h3>
                                        <ul className="space-y-3">
                                            {roadmapData.resources.map((res, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="text-fuchsia-500 mt-1">•</span>
                                                    <span className="text-sm text-slate-300">{res}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h3 className="text-sm font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                                            <Zap size={16} />
                                            Project Suggestions
                                        </h3>
                                        <ul className="space-y-4">
                                            {roadmapData.projects.map((proj, i) => (
                                                <li key={i} className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                                    <h4 className="text-sm font-bold text-slate-200 mb-1">{proj.title}</h4>
                                                    <p className="text-xs text-slate-400">{proj.description}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    {roadmapData.aiFeedback && (
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
                                            <h3 className="text-sm font-semibold text-indigo-400 mb-2">AI Strategy Note</h3>
                                            <p className="text-sm text-slate-300 italic">"{roadmapData.aiFeedback}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </motion.div>
        </div>
    );
};

export default Roadmap;
