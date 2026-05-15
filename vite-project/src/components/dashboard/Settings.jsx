import React, { useState } from 'react';
import { 
    User, 
    Bell, 
    Shield, 
    Smartphone, 
    Globe, 
    Palette,
    Check,
    ChevronRight,
    Camera,
    Mail,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [saved, setSaved] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'connected', label: 'Connected Apps', icon: Globe },
    ];

    return (
        <div className="h-full flex flex-col bg-slate-950/50 rounded-[2rem] border border-white/5 overflow-hidden animate-in fade-in duration-700">
            {/* Header section with minimal height */}
            <div className="px-8 pt-8 pb-6 border-b border-white/5 bg-slate-900/20 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">System Settings</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-widest">Configuration & Preferences</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                            saved 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-white text-slate-950 hover:bg-cyan-400 hover:scale-105 active:scale-95 shadow-xl shadow-white/5'
                        }`}
                    >
                        {saved ? <><Check size={14} /> Changes Saved</> : 'Sync All Changes'}
                    </button>
                </div>
            </div>

            {/* Main scrollable body */}
            <div className="flex flex-grow overflow-hidden">
                {/* Navigation Sidebar */}
                <div className="w-64 border-r border-white/5 bg-slate-900/10 p-4 flex flex-col gap-1 shrink-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                    isActive
                                        ? 'bg-white/10 text-white shadow-2xl border border-white/10'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                            >
                                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}`}>
                                    <Icon size={16} />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                    {tab.label}
                                </span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />}
                            </button>
                        );
                    })}
                    
                    <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 border border-white/5">
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            All settings are synchronized across your connected devices automatically.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-10 bg-slate-900/5">
                    {activeTab === 'account' && (
                        <div className="max-w-3xl space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                            <section>
                                <div className="flex items-center gap-8 mb-10">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 p-1 rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-2xl shadow-cyan-500/20">
                                            <div className="w-full h-full rounded-[1.4rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300">
                                            <Camera size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Identity</h2>
                                        <p className="text-slate-400 text-sm mt-1">This info will be visible on your public recruiter profile.</p>
                                        <div className="mt-4 flex gap-2">
                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400">PRO USER</span>
                                            <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-bold text-cyan-400">SYNCED</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                                            <input 
                                                type="text" 
                                                defaultValue="Anushree Agrawal"
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-slate-950 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                                            <input 
                                                type="email" 
                                                defaultValue="anushree@trackcode.ai"
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-slate-950 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Professional Bio</label>
                                        <textarea 
                                            rows="4"
                                            placeholder="Ex: Competitive programmer specializing in DP and Graph algorithms. Building scalable architectures."
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-slate-950 transition-all shadow-inner resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-white mb-2">Alert Configuration</h2>
                            <p className="text-slate-500 text-sm mb-8 italic">Choose how and when you want to be notified about platform events.</p>
                            
                            <div className="space-y-3">
                                {[
                                    { id: 'contests', label: 'Contest Reminders', desc: 'Notify 1 hour before contests start.' },
                                    { id: 'milestones', label: 'Achievement Alerts', desc: 'When you hit solving streaks or rank up.' },
                                    { id: 'insights', label: 'AI Strategy Updates', desc: 'Weekly insights on your skill gaps.' },
                                ].map((item) => (
                                    <div key={item.id} className="group flex items-center justify-between p-6 rounded-3xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-all">
                                        <div>
                                            <h4 className="text-sm font-bold text-white tracking-wide">{item.label}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-white">Access & Security</h2>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Change Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="Current Password"
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="New Password"
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-all"
                                        />
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="Verify Password"
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-all"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                                    </button>
                                </div>
                                <div className="pt-8 border-t border-white/5">
                                    <button className="px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5">
                                        Delete My Data Forever
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'connected' && (
                        <div className="max-w-3xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-white">Active Integrations</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { name: 'LeetCode', icon: 'https://leetcode.com/favicon.ico', connected: true, handle: 'anushree_01' },
                                    { name: 'Codeforces', icon: 'https://codeforces.com/favicon.ico', connected: false, handle: '-' },
                                    { name: 'CodeChef', icon: 'https://www.codechef.com/favicon.ico', connected: true, handle: 'anushree_123' },
                                    { name: 'AtCoder', icon: 'https://atcoder.jp/favicon.ico', connected: false, handle: '-' },
                                ].map((platform) => (
                                    <div key={platform.name} className="flex items-center justify-between p-6 rounded-3xl bg-slate-950/40 border border-white/5 group hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center p-3 shadow-2xl border border-white/5">
                                                <img src={platform.icon} alt={platform.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white tracking-wide">{platform.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${platform.connected ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                        {platform.connected ? `Linked as ${platform.handle}` : 'Awaiting Connection'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            platform.connected 
                                            ? 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10' 
                                            : 'bg-cyan-500 text-slate-950 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/10'
                                        }`}>
                                            {platform.connected ? 'Disconnect' : 'Connect Now'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
