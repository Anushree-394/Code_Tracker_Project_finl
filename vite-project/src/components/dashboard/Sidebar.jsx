import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import {
    LayoutDashboard,
    Trophy,
    BrainCircuit,
    BarChart3,
    Target,
    Bell,
    HelpCircle,
    LogOut,
    ChevronRight,
    BookOpen,
    User
} from 'lucide-react';

const ProfileCard = ({ user }) => (
    <Link to="/profile" className="block bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 hover:bg-white/10 transition-all cursor-pointer group">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 p-0.5 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors">{user.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    {user.level}
                </span>
            </div>
        </div>
        <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Solved</span>
            <span className="text-white font-medium">{user.totalSolved}</span>
        </div>
    </Link>
);

const PlatformCard = ({ platform }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3 hover:bg-white/10 transition-colors cursor-pointer group">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={platform.logo} alt={platform.name} className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-white">{platform.name}</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${platform.status === 'Linked'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                }`}>
                {platform.status}
            </span>
        </div>
        <div className="text-[10px] text-slate-400 mb-1">@{platform.handle}</div>
        <div className="flex justify-between items-center">
            <div className="text-[10px]">
                <span className="text-slate-500">Solved: </span>
                <span className="text-slate-200">{platform.solvedCount}</span>
            </div>
            <div className="text-[10px]">
                <span className="text-slate-500">Rating: </span>
                <span className="text-cyan-400">{platform.rating}</span>
            </div>
        </div>
    </div>
);

const NavItem = ({ icon: Icon, label, to, active = false, onClick, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const hasChildren = React.Children.count(children) > 0;

    const content = (
        <button
            onClick={(e) => {
                if (onClick) onClick(e);
                if (hasChildren) setIsOpen(!isOpen);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${active
                ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 border border-white/10 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            {hasChildren ? (
                <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
            ) : (
                active && <ChevronRight size={14} className="text-cyan-400" />
            )}
        </button>
    );

    return (
        <div className="mb-1">
            {!hasChildren && to ? (
                <Link to={to}>{content}</Link>
            ) : content}
            {isOpen && hasChildren && (
                <div className="ml-6 mt-1 space-y-1 border-l border-white/5 pl-3">
                    {children}
                </div>
            )}
        </div>
    );
};

const SubNavItem = ({ label, to }) => (
    <Link to={to} className="block w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5">
        {label}
    </Link>
);

const Sidebar = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalSolved, setTotalSolved] = useState(0);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const extractHandle = (url) => {
        if (!url) return '';
        try {
            const parts = url.split('/');
            const cleanParts = parts.filter(p => p !== '');
            return cleanParts[cleanParts.length - 1];
        } catch (e) { return ''; }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const profile = data[0];
                        setProfileData(profile);
                        
                        let solved = 0;
                        // Fetch LeetCode
                        if (profile.leetcode) {
                            try {
                                const handle = extractHandle(profile.leetcode);
                                const resp = await fetch(`http://localhost:5001/api/leetcode/${handle}`);
                                if (resp.ok) {
                                    const d = await resp.json();
                                    solved += d.matchedUser?.submitStats?.acSubmissionNum[0]?.count || 0;
                                }
                            } catch (e) {}
                        }
                        // Fetch CodeChef
                        if (profile.codechef) {
                            try {
                                const handle = extractHandle(profile.codechef);
                                const resp = await fetch(`http://localhost:5001/api/codechef/${handle}`);
                                if (resp.ok) {
                                    const d = await resp.json();
                                    solved += parseInt(d.solvedCount) || 0;
                                }
                            } catch (e) {}
                        }
                        // Fetch Codeforces
                        if (profile.codeforces) {
                            try {
                                const handle = extractHandle(profile.codeforces);
                                const resp = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
                                if (resp.ok) {
                                    const d = await resp.json();
                                    if (d.status === 'OK') {
                                        solved += new Set(d.result.filter(s => s.verdict === 'OK').map(s => s.problem.name)).size;
                                    }
                                }
                            } catch (e) {}
                        }
                        setTotalSolved(solved);
                    }
                }
            } catch (error) {
                console.error("Error fetching sidebar data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const user = {
        name: profileData?.fullName || "User",
        avatar: profileData?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData?.username || 'User'}`,
        level: "Beginner",
        totalSolved: loading ? "..." : totalSolved
    };

    const platforms = [
        {
            name: "Codeforces",
            logo: "https://cdn.iconscout.com/icon/free/png-256/free-code-forces-3628695-3029920.png",
            handle: extractHandle(profileData?.codeforces),
            solvedCount: 0,
            rating: "N/A",
            status: profileData?.codeforces ? "Linked" : "Not Linked"
        },
        {
            name: "LeetCode",
            logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
            handle: extractHandle(profileData?.leetcode),
            solvedCount: 0,
            rating: "N/A",
            status: profileData?.leetcode ? "Linked" : "Not Linked"
        },
        {
            name: "CodeChef",
            logo: "https://cdn.iconscout.com/icon/free/png-256/free-codechef-3628701-3029926.png",
            handle: extractHandle(profileData?.codechef),
            solvedCount: 0,
            rating: "N/A",
            status: profileData?.codechef ? "Linked" : "Not Linked"
        },
        {
            name: "AtCoder",
            logo: "https://img.atcoder.jp/assets/logo.png",
            handle: extractHandle(profileData?.atcoder),
            solvedCount: 0,
            rating: "N/A",
            status: profileData?.atcoder ? "Linked" : "Not Linked"
        }
    ];

    return (
        <aside className="h-full w-full bg-slate-950 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar flex flex-col">
            <Link to="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center">
                    <BrainCircuit className="text-slate-950" size={24} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    TrackCode AI
                </h1>
            </Link>

            <div className="flex-shrink-0">
                <ProfileCard user={user} />
            </div>

            <div className="mb-6 flex-shrink-0">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">
                    Menu
                </h4>
                <nav>
                    <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active />
                    <NavItem icon={User} label="My Profile" to="/profile" />
                    <NavItem icon={Trophy} label="Profiles">
                        <SubNavItem label="Codeforces" to="/dashboard/codeforces-profile" />
                        <SubNavItem label="LeetCode" to="/dashboard/leetcode-profile" />
                        <SubNavItem label="CodeChef" to="/dashboard/codechef-profile" />
                        <SubNavItem label="AtCoder" to="/dashboard/atcoder-profile" />
                    </NavItem>
                    <NavItem icon={Trophy} label="Contests">
                        <SubNavItem label="Codeforces" to="/dashboard/codeforces" />
                        <SubNavItem label="LeetCode" to="/dashboard/leetcode" />
                        <SubNavItem label="CodeChef" to="/dashboard/codechef" />
                        <SubNavItem label="AtCoder" to="/dashboard/atcoder" />
                    </NavItem>
                    <NavItem icon={BookOpen} label="Resources">
                        <SubNavItem label="DSA" to="/dashboard/resources/dsa" />
                        <SubNavItem label="Interview" to="/dashboard/resources/interview" />
                        <SubNavItem label="Aptitude" to="/dashboard/resources/aptitude" />
                        <SubNavItem label="Companies" to="/dashboard/resources/companies" />
                    </NavItem>
                    <NavItem icon={BarChart3} label="Resume Analytics" to="/dashboard/analytics" />
                    <NavItem icon={Target} label="Roadmap" to="/dashboard/roadmap" />
                    <NavItem icon={Bell} label="Notifications" to="/dashboard/notifications" />
                </nav>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex-shrink-0">
                <NavItem icon={HelpCircle} label="Help & Support" to="/dashboard/help" />
                <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
            </div>
        </aside>
    );
};

export default Sidebar;
