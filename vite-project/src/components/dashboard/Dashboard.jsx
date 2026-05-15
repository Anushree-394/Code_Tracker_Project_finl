import React from 'react';
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
    Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
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

const AIRecommendation = () => (
    <div className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-3xl p-0.5 bg-gradient-to-br from-fuchsia-500/30 via-purple-500/20 to-cyan-500/30 group">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative h-full bg-slate-900/90 backdrop-blur-xl rounded-[23px] p-6 sm:p-8">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <Sparkles size={120} className="text-fuchsia-400 blur-sm" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 ring-1 ring-fuchsia-500/30 shadow-[0_0_15px_-3px_rgba(217,70,239,0.3)]">
                            <BrainCircuit size={24} />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-fuchsia-200 bg-clip-text text-transparent">
                            AI Personal Insights
                        </h3>
                    </div>

                    <p className="text-slate-300 text-base leading-relaxed max-w-2xl mb-8 font-light">
                        “AI Insight: Connect your platforms to get personalized analysis of your coding performance and speed.”
                    </p>
                </div>

                <div className="flex gap-4">
                    <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all hover:scale-105 border border-white/10">
                        View Detailed Analysis
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 text-white text-sm font-bold hover:shadow-[0_0_20px_-5px_rgba(217,70,239,0.5)] transition-all hover:scale-105 hover:-translate-y-0.5">
                        Optimize Strategy
                    </button>
                </div>
            </div>
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
    const [upcomingContestCount, setUpcomingContestCount] = React.useState(0);
    const [topUpcomingContests, setTopUpcomingContests] = React.useState([]);

    React.useEffect(() => {
        const fetchContestCount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/contests/upcoming-summary');
                const data = await response.json();
                setUpcomingContestCount(data.totalCount || 0);
                setTopUpcomingContests(data.topContests || []);
            } catch (error) {
                console.error('Error fetching contest summary:', error);
            }
        };

        fetchContestCount();
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

    const extractHandle = (url) => {
        if (!url) return '';
        const parts = url.split('/');
        const cleanParts = parts.filter(p => p !== '');
        return cleanParts[cleanParts.length - 1];
    };

    React.useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/profile');
                if (res.ok) {
                    const profiles = await res.json();
                    if (profiles && profiles.length > 0) {
                        const profile = profiles[0];
                        let solved = 0;
                        let ratings = [];
                        let allSubs = [];

                        // 1. Fetch LeetCode
                        if (profile.leetcode) {
                            try {
                                const handle = profile.leetcode.includes('leetcode.com') ? extractHandle(profile.leetcode) : profile.leetcode;
                                const resp = await fetch(`http://localhost:5000/api/leetcode/${handle}`);
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
                            } catch (e) { console.error("CF fetch error", e); }
                        }

                        // 3. Fetch AtCoder
                        if (profile.atcoder) {
                            try {
                                const handle = profile.atcoder.includes('atcoder.jp') ? extractHandle(profile.atcoder) : profile.atcoder;
                                const resp = await fetch(`http://localhost:5000/api/atcoder/submissions/${handle}`);
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
                                solves: 0 
                            });
                        }

                        allSubs.forEach(s => {
                            const subDate = new Date(s.timestamp).toDateString();
                            const dayObj = last7Days.find(d => d.dateStr === subDate);
                            if (dayObj) dayObj.solves++;
                        });

                        setChartData(last7Days.map(({ name, solves }) => ({ name, solves })));
                        setRecentSubmissions(allSubs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
                    }
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchAllStats();
    }, []);

    const ratingData = [
        { name: 'Init', rating: 0 },
    ];

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
                <StatCard title="AI Confidence Score" value="85%" icon={Sparkles} trend="+2%" color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Charts & AI) */}
                <div className="lg:col-span-2 space-y-8">
                    <AIRecommendation />

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
                                <LineChart data={ratingData}>
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

                    {/* Pro Ad / Tip */}
                    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/5 rounded-3xl p-6 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center mx-auto mb-4">
                            <Target size={24} />
                        </div>
                        <h4 className="text-white font-semibold mb-2">Upgrade to Pro</h4>
                        <p className="text-xs text-slate-400 mb-6">Get detailed company-wise analysis and predicted rating changes.</p>
                        <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold text-white">
                            Unlock Features
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
