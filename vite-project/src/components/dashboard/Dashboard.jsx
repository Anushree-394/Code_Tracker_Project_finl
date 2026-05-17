import React from 'react';
import API_BASE_URL from '../../config';
import {
    TrendingUp,
    Users,
    Calendar,
    Award,
    ArrowUpRight,
    Clock,
    Sparkles,
    BrainCircuit,
    Target,
    Bell,
    User,
    Home,
    Map
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, color }) => {
    const colors = {
        fuchsia: 'bg-fuchsia-500/10 text-fuchsia-400',
        cyan: 'bg-cyan-500/10 text-cyan-400',
        indigo: 'bg-indigo-500/10 text-indigo-400',
        amber: 'bg-amber-500/10 text-amber-400'
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${colors[color] || ''}`}>
                    <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trend}
                    <ArrowUpRight size={12} />
                </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-slate-400 font-medium">{title}</div>
        </div>
    );
};

const WeeklyActivityChart = ({ data }) => (
    <div className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-3xl p-6 bg-white/5 border border-white/10 group">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
                <Award size={18} className="text-fuchsia-400" />
                Weekly Activity
            </h3>
            <div className="text-xs font-medium bg-fuchsia-500/20 text-fuchsia-300 px-3 py-1 rounded-full border border-fuchsia-500/30">
                {data.reduce((acc, curr) => acc + curr.solves, 0)} Solves This Week
            </div>
        </div>
        
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        cursor={{ fill: 'rgba(217,70,239,0.1)' }}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="leetcode" name="LeetCode" stackId="a" fill="#f97316" barSize={30} />
                    <Bar dataKey="codeforces" name="Codeforces" stackId="a" fill="#3b82f6" barSize={30} />
                    <Bar dataKey="atcoder" name="AtCoder" stackId="a" fill="#ef4444" barSize={30} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const ActivityItem = ({ title, platform, time, difficulty }) => {
    const diffColor = {
        'Easy': 'text-emerald-400',
        'Medium': 'text-amber-400',
        'Hard': 'text-rose-400'
    }[difficulty];

    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all mb-3">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xs font-bold border border-white/5">
                    {platform.slice(0, 1)}
                </div>
                <div>
                    <h4 className="text-sm font-medium text-white">{title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{platform}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span className={`text-[10px] font-bold ${diffColor}`}>{difficulty}</span>
                    </div>
                </div>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock size={12} />
                {time}
            </div>
        </div>
    );
};

const UpcomingContest = ({ name, platform, date, countdown }) => (
    <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 mb-3 group hover:border-cyan-500/30 transition-all">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{name}</h4>
                <div className="text-[10px] text-slate-500 mt-0.5">{platform}</div>
            </div>
            <button className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10">
                <Bell size={14} />
            </button>
        </div>
        <div className="flex justify-between items-center mt-4">
            <div className="text-[10px] text-slate-400">{date}</div>
            <div className="text-[10px] font-bold px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {countdown}
            </div>
        </div>
    </div>
);


const Dashboard = () => {
    const navigate = useNavigate();
    const [upcomingContestCount, setUpcomingContestCount] = React.useState(0);
    const [topUpcomingContests, setTopUpcomingContests] = React.useState([]);
    const [activeRoadmaps, setActiveRoadmaps] = React.useState([]);

    React.useEffect(() => {
        const fetchContestCount = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/contests/upcoming-summary`);
                const data = await response.json();
                setUpcomingContestCount(data.totalCount || 0);
                setTopUpcomingContests(data.topContests || []);
            } catch (error) {
                console.error('Error fetching contest summary:', error);
            }
        };

        fetchContestCount();

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/roadmap/${currentUser.uid}`);
                    if (res.ok) {
                        const data = await res.json();
                        setActiveRoadmaps(data);
                    }
                } catch (e) { console.error("Error fetching roadmaps:", e); }
            }
        });

        return () => unsubscribe();
    }, []);

    const [totalSolved, setTotalSolved] = React.useState(0);
    const [avgRating, setAvgRating] = React.useState(0);
    const [loadingStats, setLoadingStats] = React.useState(true);
    const [recentSubmissions, setRecentSubmissions] = React.useState([]);
    const [chartData, setChartData] = React.useState([
        { name: 'Mon', solves: 0 },
        { name: 'Tue', solves: 0 },
        { name: 'Wed', solves: 0 },
        { name: 'Thu', solves: 0 },
        { name: 'Fri', solves: 0 },
        { name: 'Sat', solves: 0 },
        { name: 'Sun', solves: 0 },
    ]);
    const [ratingProgressionData, setRatingProgressionData] = React.useState([{ name: 'Init', rating: 0 }]);
    const [aiConfidenceScore, setAiConfidenceScore] = React.useState(15);
    const [aiTrend, setAiTrend] = React.useState("Stable");

    const extractHandle = (url) => {
        if (!url) return '';
        const parts = url.split('/');
        const cleanParts = parts.filter(p => p !== '');
        return cleanParts[cleanParts.length - 1];
    };

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setTotalSolved(0);
                setAvgRating(0);
                setRecentSubmissions([]);
                setChartData([
                    { name: 'Mon', solves: 0 },
                    { name: 'Tue', solves: 0 },
                    { name: 'Wed', solves: 0 },
                    { name: 'Thu', solves: 0 },
                    { name: 'Fri', solves: 0 },
                    { name: 'Sat', solves: 0 },
                    { name: 'Sun', solves: 0 },
                ]);
                setRatingProgressionData([{ name: 'Init', rating: 0 }]);
                setLoadingStats(false);
                return;
            }

            try {
                setLoadingStats(true);
                const res = await fetch(`${API_BASE_URL}/api/profile/${currentUser.uid}`);
                if (res.ok) {
                    const profile = await res.json();
                    if (profile) {
                        let solved = 0;
                        let ratings = [];
                        let allSubs = [];

                        // 1. Fetch LeetCode
                        if (profile.leetcode) {
                            try {
                                const handle = profile.leetcode.includes('leetcode.com') ? extractHandle(profile.leetcode) : profile.leetcode;
                                const resp = await fetch(`${API_BASE_URL}/api/leetcode/${handle}`);
                                if (resp.ok) {
                                    const data = await resp.json();
                                    solved += data.matchedUser?.submitStats?.acSubmissionNum[0]?.count || 0;
                                    if (data.userContestRanking?.rating) ratings.push(data.userContestRanking.rating);
                                    
                                    // Recent Submissions
                                    if (data.recentSubmissionList) {
                                        data.recentSubmissionList.forEach(s => {
                                            if (s.statusDisplay === 'Accepted') {
                                                allSubs.push({
                                                    platform: 'LeetCode',
                                                    title: s.title,
                                                    timestamp: parseInt(s.timestamp) * 1000,
                                                    status: 'Accepted'
                                                });
                                            }
                                        });
                                    }
                                }
                            } catch (e) { console.error("LC fetch error", e); }
                        }

                        // 2. Fetch Codeforces
                        if (profile.codeforces) {
                            try {
                                const handle = profile.codeforces.includes('codeforces.com') ? extractHandle(profile.codeforces) : profile.codeforces;
                                const subResp = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
                                if (subResp.ok) {
                                    const subData = await subResp.json();
                                    if (subData.status === 'OK') {
                                        const solvedCF = new Set(
                                            subData.result
                                                .filter(s => s.verdict === 'OK')
                                                .map(s => `${s.problem.contestId}${s.problem.index}`)
                                        ).size;
                                        solved += solvedCF;
                                        
                                        subData.result.forEach(s => {
                                            if (s.verdict === 'OK') {
                                                allSubs.push({
                                                    platform: 'Codeforces',
                                                    title: s.problem.name,
                                                    timestamp: s.creationTimeSeconds * 1000,
                                                    status: 'Accepted'
                                                });
                                            }
                                        });
                                    }
                                }
                                const infoResp = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
                                if (infoResp.ok) {
                                    const infoData = await infoResp.json();
                                    if (infoData.status === 'OK' && infoData.result[0].rating) {
                                        ratings.push(infoData.result[0].rating);
                                    }
                                }
                                
                                const ratingHistoryResp = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
                                if (ratingHistoryResp.ok) {
                                    const ratingHistData = await ratingHistoryResp.json();
                                    if (ratingHistData.status === 'OK' && ratingHistData.result.length > 0) {
                                        const formattedRatings = ratingHistData.result.map((r, i) => ({
                                            name: `C${i + 1}`,
                                            rating: r.newRating
                                        }));
                                        // Keep only the last 15 contests for a cleaner chart
                                        setRatingProgressionData(formattedRatings.slice(-15));
                                    }
                                }
                            } catch (e) { console.error("CF fetch error", e); }
                        }

                        // 3. Fetch AtCoder
                        if (profile.atcoder) {
                            try {
                                const handle = profile.atcoder.includes('atcoder.jp') ? extractHandle(profile.atcoder) : profile.atcoder;
                                const resp = await fetch(`${API_BASE_URL}/api/atcoder/submissions/${handle}`);
                                if (resp.ok) {
                                    const data = await resp.json();
                                    const solvedAtCoder = new Set(
                                        data.filter(s => s.result === 'AC').map(s => s.problem_id)
                                    ).size;
                                    solved += solvedAtCoder;
                                    
                                    data.forEach(s => {
                                        if (s.result === 'AC') {
                                            allSubs.push({
                                                platform: 'AtCoder',
                                                title: s.problem_id,
                                                timestamp: s.epoch_second * 1000,
                                                status: 'Accepted'
                                            });
                                        }
                                    });
                                }
                            } catch (e) { console.error("AtCoder fetch error", e); }
                        }

                        setTotalSolved(solved);
                        if (ratings.length > 0) {
                            setAvgRating(Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length));
                        }

                        // Process Chart Data (Last 7 Days)
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const last7Days = [];
                        for (let i = 6; i >= 0; i--) {
                            const d = new Date();
                            d.setDate(d.getDate() - i);
                            last7Days.push({ 
                                name: days[d.getDay()], 
                                dateStr: d.toDateString(), 
                                solves: 0,
                                leetcode: 0,
                                codeforces: 0,
                                atcoder: 0
                            });
                        }

                        allSubs.forEach(s => {
                            const subDate = new Date(s.timestamp).toDateString();
                            const dayObj = last7Days.find(d => d.dateStr === subDate);
                            if (dayObj) {
                                dayObj.solves++;
                                if (s.platform === 'LeetCode') dayObj.leetcode++;
                                if (s.platform === 'Codeforces') dayObj.codeforces++;
                                if (s.platform === 'AtCoder') dayObj.atcoder++;
                            }
                        });

                        setChartData(last7Days.map(({ name, solves, leetcode, codeforces, atcoder }) => ({ name, solves, leetcode, codeforces, atcoder })));
                        setRecentSubmissions(allSubs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
                    }
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoadingStats(false);
            }
        });

        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        // Calculate AI Confidence Score dynamically based on real-time performance metrics
        // 1. Solved Problems Contribution: Up to 40% (1% for every 10 solved problems)
        const solvedContribution = Math.min(40, totalSolved / 10);

        // 2. Average Rating Contribution: Up to 35% (avgRating / 2500 * 35)
        const ratingContribution = avgRating > 0 ? Math.min(35, (avgRating / 2500) * 35) : 0;

        // 3. Roadmap Contribution: Up to 15% (5% per active roadmap)
        const roadmapContribution = Math.min(15, activeRoadmaps.length * 5);

        // 4. Resume Match Contribution: Up to 10% (matchScore / 100 * 10)
        let resumeContribution = 0;
        try {
            const savedAnalysis = localStorage.getItem('resumeAnalysis');
            if (savedAnalysis) {
                const parsed = JSON.parse(savedAnalysis);
                if (parsed && typeof parsed.matchScore === 'number') {
                    resumeContribution = Math.min(10, (parsed.matchScore / 100) * 10);
                }
            }
        } catch (e) {
            console.error("Error parsing resume analysis in Dashboard:", e);
        }

        let calculatedScore = Math.round(solvedContribution + ratingContribution + roadmapContribution + resumeContribution);
        
        // Starting base score if completely empty
        if (calculatedScore === 0) {
            calculatedScore = 15;
        }

        // Realistic limits (10% to 99%)
        calculatedScore = Math.max(10, Math.min(calculatedScore, 99));
        setAiConfidenceScore(calculatedScore);

        // Dynamic Trend Calculation
        if (totalSolved > 0 || avgRating > 0 || activeRoadmaps.length > 0) {
            const trendVal = Math.min(12, Math.floor(totalSolved / 25) + 1);
            setAiTrend(`+${trendVal}%`);
        } else {
            setAiTrend("Stable");
        }
    }, [totalSolved, avgRating, activeRoadmaps]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="pointer-events-none absolute top-0 right-0 -mr-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl opacity-50" />
            <div className="pointer-events-none absolute bottom-0 left-0 -ml-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl opacity-50" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Welcome!</h2>
                    <p className="text-slate-400 text-sm mt-1">Connect your accounts to see your coding progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors">
                        <Home size={14} />
                        Home Page
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        Not Synced
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 text-xs font-bold hover:opacity-90 transition-opacity">
                        <Sparkles size={14} />
                        AI Global Rank: N/A
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Solved Problems" 
                    value={loadingStats ? "..." : totalSolved} 
                    icon={Award} 
                    trend={totalSolved > 0 ? `+${totalSolved}` : "0"} 
                    color="fuchsia" 
                />
                <StatCard 
                    title="Upcoming Contests" 
                    value={upcomingContestCount} 
                    icon={Calendar} 
                    trend="N/A" 
                    color="cyan" 
                />
                <StatCard 
                    title="Average Rating" 
                    value={loadingStats ? "..." : avgRating} 
                    icon={TrendingUp} 
                    trend={avgRating > 0 ? "Live" : "0"} 
                    color="indigo" 
                />
                <StatCard 
                    title="AI Confidence Score" 
                    value={loadingStats ? "..." : `${aiConfidenceScore}%`} 
                    icon={Sparkles} 
                    trend={aiTrend} 
                    color="amber" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <WeeklyActivityChart data={chartData} />

                    {activeRoadmaps.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Map size={18} className="text-cyan-400" />
                                Active Roadmaps ({activeRoadmaps.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeRoadmaps.map((rm, idx) => (
                                    <div key={idx} className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-3xl p-5 relative overflow-hidden group flex flex-col justify-between">
                                        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                                            <Map size={100} />
                                        </div>
                                        <div className="relative z-10 mb-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                                                    In Progress
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium bg-slate-900/50 px-2 py-0.5 rounded-full">
                                                    {rm.completedTasks ? rm.completedTasks.length : 0} tasks done
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-200 line-clamp-1">{rm.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">Goal: {rm.goal}</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/dashboard/roadmap')}
                                            className="w-full py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 transition-all hover:scale-[1.02] active:scale-95"
                                        >
                                            Continue Learning
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <h3 className="font-semibold text-white mb-6">Recent Solvings</h3>
                        <div className="space-y-4">
                            {recentSubmissions.length > 0 ? (
                                recentSubmissions.map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                                                sub.platform === 'LeetCode' ? 'bg-orange-500/10 text-orange-500' :
                                                sub.platform === 'Codeforces' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                                {sub.platform === 'LeetCode' ? '🧮' : sub.platform === 'Codeforces' ? '🏆' : '🎯'}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{sub.title}</h4>
                                                <p className="text-xs text-slate-500">{sub.platform} • {new Date(sub.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
                                                {sub.status}
                                            </span>
                                            <span className="text-[10px] text-slate-600">{new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-500 text-sm italic">
                                    {loadingStats ? "Fetching recent activity..." : "No recent activity found. Start solving to see your progress!"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (Rating & Upcoming) */}
                <div className="space-y-8">
                    {/* Rating Chart */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <h3 className="font-semibold text-white mb-4 text-sm">Rating Progression</h3>
                        <div className="h-[150px] w-full mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ratingProgressionData}>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                    />
                                    <Line type="monotone" dataKey="rating" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4, fill: '#22d3ee' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center italic">
                            Keep solving Hard problems to push 1600+
                        </div>
                    </div>

                    {/* Upcoming Contests */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-white">Upcoming Contests</h3>
                            <button className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300">View All</button>
                        </div>
                        {topUpcomingContests.length > 0 ? (
                            topUpcomingContests.map((contest, index) => (
                                <UpcomingContest
                                    key={index}
                                    name={contest.name}
                                    platform={contest.platform}
                                    date={contest.date}
                                    countdown="Join Now"
                                />
                            ))
                        ) : (
                            <div className="text-center py-6 text-slate-500 text-xs italic">
                                No upcoming contests found at the moment.
                            </div>
                        )}
                    </div>

                    {/* Weekly Goal */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-all" />
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-white font-semibold text-sm">Weekly Goal</h4>
                                <p className="text-xs text-slate-400 mt-1">Solve 20 problems</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                                <Target size={20} />
                            </div>
                        </div>
                        
                        <div className="space-y-2 mt-6">
                            <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                                <span>
                                    {chartData.reduce((acc, curr) => acc + curr.solves, 0)} solved
                                </span>
                                <span>20 target</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (chartData.reduce((acc, curr) => acc + curr.solves, 0) / 20) * 100)}%` }}
                                />
                            </div>
                        </div>
                        
                        <p className="text-[10px] text-slate-500 mt-5 text-center italic">
                            Consistency is key. Keep up the momentum!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
