import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config';
import { Bell, Calendar, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const allNotifications = [];

                // 1. Fetch Upcoming Contests
                const contestRes = await fetch(`${API_BASE_URL}/api/contests/upcoming-summary`);
                if (contestRes.ok) {
                    const contestData = await contestRes.json();
                    const topContests = contestData.topContests || [];
                    const now = Date.now();
                    const twoDaysFromNow = now + (2 * 24 * 60 * 60 * 1000);
                    
                    topContests.forEach(contest => {
                        const isSoon = contest.startTime < twoDaysFromNow;
                        allNotifications.push({
                            id: `contest-${contest.name}-${contest.startTime}`,
                            type: isSoon ? 'registration' : 'contest',
                            title: isSoon ? 'Registration Reminder' : 'Upcoming Contest',
                            message: isSoon 
                                ? `Registration for ${contest.name} on ${contest.platform} ends soon! Contest starts on ${contest.date}.`
                                : `${contest.name} on ${contest.platform} is scheduled for ${contest.date}.`,
                            platform: contest.platform,
                            time: isSoon ? 'Register Now' : 'Contest Alert',
                            icon: isSoon ? Zap : Calendar,
                            color: isSoon ? 'text-amber-400' : 'text-cyan-400',
                            bgColor: isSoon ? 'bg-amber-400/10' : 'bg-cyan-400/10'
                        });
                    });
                }

                // 2. Check Activity (Inactivity Reminders)
                const profileRes = await fetch(`${API_BASE_URL}/api/profile`);
                if (profileRes.ok) {
                    const profiles = await profileRes.json();
                    if (profiles && profiles.length > 0) {
                        const profile = profiles[0];
                        const platforms = [
                            { name: 'LeetCode', url: profile.leetcode },
                            { name: 'Codeforces', url: profile.codeforces },
                            { name: 'CodeChef', url: profile.codechef },
                            { name: 'AtCoder', url: profile.atcoder }
                        ];

                        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

                        for (const plat of platforms) {
                            if (!plat.url) continue;

                            let lastSubTime = 0;
                            const handle = plat.url.split('/').filter(p => p !== '').pop();

                            try {
                                if (plat.name === 'LeetCode') {
                                    const res = await fetch(`${API_BASE_URL}/api/leetcode/${handle}`);
                                    if (res.ok) {
                                        const data = await res.json();
                                        if (data.recentSubmissionList?.[0]) {
                                            lastSubTime = parseInt(data.recentSubmissionList[0].timestamp) * 1000;
                                        }
                                    }
                                } else if (plat.name === 'Codeforces') {
                                    const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
                                    if (res.ok) {
                                        const data = await res.json();
                                        if (data.result?.[0]) {
                                            lastSubTime = data.result[0].creationTimeSeconds * 1000;
                                        }
                                    }
                                } else if (plat.name === 'AtCoder') {
                                    const res = await fetch(`${API_BASE_URL}/api/atcoder/submissions/${handle}`);
                                    if (res.ok) {
                                        const data = await res.json();
                                        if (data?.[0]) {
                                            lastSubTime = data[0].epoch_second * 1000;
                                        }
                                    }
                                } else if (plat.name === 'CodeChef') {
                                    const res = await fetch(`${API_BASE_URL}/api/codechef/${handle}`);
                                    if (res.ok) {
                                        const data = await res.json();
                                        // CodeChef API might not give timestamp easily, but if we have solved count we can skip for now or use a placeholder
                                    }
                                }

                                const lastDateStr = lastSubTime > 0 ? new Date(lastSubTime).toLocaleDateString() : 'Long ago';

                                if (lastSubTime < sevenDaysAgo) {
                                    allNotifications.push({
                                        id: `inactive-${plat.name}-${Date.now()}`,
                                        type: 'reminder',
                                        title: `${plat.name} Consistency Alert`,
                                        message: `Your last submission on ${plat.name} was on ${lastDateStr}. You're falling behind your goals!`,
                                        platform: plat.name,
                                        time: 'Inactivity Reminder',
                                        icon: AlertCircle,
                                        color: 'text-fuchsia-500',
                                        bgColor: 'bg-fuchsia-500/10',
                                        lastSolved: lastDateStr
                                    });
                                }
                            } catch (e) {
                                console.error(`Error checking ${plat.name}:`, e);
                            }
                        }
                    }
                }

                // Add some dummy "Welcome" or "Sync" notifications if empty
                if (allNotifications.length === 0) {
                    allNotifications.push({
                        id: 'welcome',
                        type: 'info',
                        title: 'All Caught Up!',
                        message: 'No new contest alerts or inactivity reminders. Great job staying consistent!',
                        time: 'Just now',
                        icon: CheckCircle2,
                        color: 'text-emerald-400',
                        bgColor: 'bg-emerald-400/10'
                    });
                }

                setNotifications(allNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Bell className="text-fuchsia-500" />
                            Notifications
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Contest alerts and consistency reminders</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors">
                        Mark all as read
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin" />
                        <p className="text-slate-500 animate-pulse">Syncing your activity...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all">
                                <div className={`absolute top-0 left-0 w-1 h-full ${
                                    notif.type === 'registration' ? 'bg-amber-400' :
                                    notif.type === 'contest' ? 'bg-cyan-400' : 
                                    notif.type === 'reminder' ? 'bg-fuchsia-500' : 
                                    'bg-emerald-400'
                                }`} />
                                
                                <div className="flex gap-6">
                                    <div className={`w-14 h-14 rounded-2xl ${notif.bgColor} flex items-center justify-center flex-shrink-0`}>
                                        <notif.icon className={notif.color} size={28} />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                                                {notif.time}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                            {notif.message}
                                        </p>
                                        
                                        <div className="flex items-center gap-3">
                                            {notif.type === 'registration' && (
                                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold text-amber-400 hover:bg-amber-400/20 transition-colors">
                                                    <Zap size={12} />
                                                    Register Now
                                                </button>
                                            )}
                                            {notif.type === 'contest' && (
                                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-bold text-cyan-400 hover:bg-cyan-400/20 transition-colors">
                                                    <Clock size={12} />
                                                    Set Reminder
                                                </button>
                                            )}
                                            {notif.type === 'reminder' && (
                                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-[10px] font-bold text-fuchsia-500 hover:bg-fuchsia-500/20 transition-colors">
                                                    <Zap size={12} />
                                                    Solve Now
                                                </button>
                                            )}
                                            <button className="text-[10px] text-slate-500 hover:text-white transition-colors">
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && notifications.length > 0 && (
                    <div className="mt-10 p-6 rounded-3xl bg-gradient-to-br from-fuchsia-500/10 to-cyan-400/10 border border-white/5 text-center">
                        <p className="text-xs text-slate-500 italic">
                            "Consistency is what transforms average into excellence."
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
