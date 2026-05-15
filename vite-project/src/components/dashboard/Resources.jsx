import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, Code, ExternalLink, Sparkles, BrainCircuit, Zap, Users, ArrowRight } from 'lucide-react';

const ResourceCard = ({ title, description, type, link }) => {
    let Icon = BookOpen;
    if (type === 'video') Icon = Video;
    if (type === 'article') Icon = FileText;
    if (type === 'practice') Icon = Code;

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block group h-full">
            <div className="relative overflow-hidden h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-0.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#06b6d4]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-[15px] bg-slate-950/90 p-5 backdrop-blur-3xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-400 ring-1 ring-white/10 group-hover:scale-110 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300">
                            <Icon size={20} />
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-400 group-hover:border-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                            {type}
                        </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
                        {title}
                    </h3>

                    <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
                        {description}
                    </p>

                    <div className="mt-auto pt-4 flex items-center text-xs font-medium text-cyan-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        Open Resource <ExternalLink size={12} className="ml-1" />
                    </div>
                </div>
            </div>
        </a>
    );
};

const CompanyCard = ({ name, logo, link }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="relative overflow-hidden rounded-xl bg-white/5 p-px transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-between rounded-[11px] bg-slate-900/50 p-4 backdrop-blur-sm border border-white/5 group-hover:border-white/10">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white p-2 shadow-sm">
                        <img
                            src={logo}
                            alt={name}
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.innerText = name[0];
                                e.target.parentNode.className += " flex items-center justify-center text-xl font-bold text-slate-900 h-full w-full";
                            }}
                        />
                    </div>
                    <span className="font-semibold text-slate-200 transition-colors group-hover:text-white">{name}</span>
                </div>
                <ExternalLink
                    size={16}
                    className="text-slate-500 transition-all duration-300 group-hover:text-fuchsia-400 group-hover:translate-x-1"
                />
            </div>
        </div>
    </a>
);

const Resources = ({ category }) => {
    const allResources = {
        DSA: [
            {
                title: "Striver's SDE Sheet",
                description: "Top 180+ coding interview questions curated by Striver.",
                type: "practice",
                link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
            },
            {
                title: "Blind 75 LeetCode",
                description: "75 essential LeetCode questions to cover all common patterns.",
                type: "practice",
                link: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions"
            },
            {
                title: "Algorithms by Abdul Bari",
                description: "Deep dive into algorithm analysis and design.",
                type: "video",
                link: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O"
            },
            {
                title: "Introduction to Algorithms",
                description: "Comprehensive textbook on algorithms and data structures.",
                type: "article",
                link: "https://en.wikipedia.org/wiki/Introduction_to_Algorithms"
            }
        ],
        Interview: [
            {
                title: "System Design Primer",
                description: "Learn how to design large-scale systems for interviews.",
                type: "article",
                link: "https://github.com/donnemartin/system-design-primer"
            },
            {
                title: "Behavioral Interview Guide",
                description: "How to answer 'Tell me about a time' questions using STAR method.",
                type: "video",
                link: "#"
            },
            {
                title: "Mock Interview Practice",
                description: "Practice technical interviews with peers anonymously.",
                type: "practice",
                link: "https://pramp.com"
            }
        ],
        Aptitude: []
    };

    const companies = [
        { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", link: "https://workat.tech/company/microsoft/interview-questions/problem-solving" },
        { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", link: "https://workat.tech/company/amazon/interview-questions/problem-solving" },
        { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", link: "https://workat.tech/company/google/interview-questions/problem-solving" },
        { name: "Flipkart", logo: "https://upload.wikimedia.org/wikipedia/en/2/2f/Flipkart_logo_croppped.png", link: "https://workat.tech/company/flipkart/interview-questions/problem-solving" },
        { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png", link: "https://workat.tech/company/adobe/interview-questions/problem-solving" },
        { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png", link: "https://workat.tech/company/uber/interview-questions/problem-solving" },
        { name: "Swiggy", logo: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/logo_192x192.png", link: "https://workat.tech/company/swiggy/interview-questions/problem-solving" },
        { name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg", link: "https://workat.tech/company/paytm/interview-questions/problem-solving" },
        { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg", link: "https://workat.tech/company/oracle/interview-questions/problem-solving" },
        { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", link: "https://workat.tech/company/samsung/interview-questions/problem-solving" },
        { name: "MakeMyTrip", logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/MakeMyTrip_Logo.svg", link: "https://workat.tech/company/makemytrip/interview-questions/problem-solving" },
        { name: "Morgan Stanley", logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo_1.svg", link: "https://workat.tech/company/morgan-stanley/interview-questions/problem-solving" }
    ];

    const resources = allResources[category] || [];

    return (
        <div className="relative min-h-full p-6 md:p-10 overflow-hidden">
            {/* Background decoration */}
            <div className="pointer-events-none absolute top-0 right-0 -mr-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl opacity-50" />
            <div className="pointer-events-none absolute bottom-0 left-0 -ml-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl opacity-50" />

            <div className="relative mb-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-4">
                    <Sparkles size={12} className="text-amber-300" />
                    <span className="text-[10px] font-medium tracking-wide text-slate-300 uppercase">Premium Resources</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
                    <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">{category}</span> Library
                </h1>
                <p className="max-w-2xl text-lg text-slate-400">
                    Hand-picked articles, videos, and practice problems to help you master {category}.
                </p>
            </div>

            {category === 'Companies' ? (
                <div className="relative">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
                            Target Top Companies
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {companies.map((company, index) => (
                            <CompanyCard key={index} {...company} />
                        ))}
                    </div>
                </div>
            ) : category === 'Interview' ? (
                <div className="relative">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                            Select Interview Mode
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Technical Concepts */}
                        <Link to="/dashboard/resources/interview/technical" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#06b6d4]">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex flex-col h-full">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <BrainCircuit size={28} className="text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Live Interview</h3>
                                <p className="text-slate-400 mb-6 flex-grow">
                                    Master core CS fundamentals, System Design, and Architecture patterns.
                                </p>
                                <div className="flex items-center text-cyan-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Start Learning <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </Link>

                        {/* Rapid Fire */}
                        <Link to="/dashboard/resources/interview/rapid-fire" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#f59e0b]">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex flex-col h-full">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Zap size={28} className="text-amber-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Rapid Fire</h3>
                                <p className="text-slate-400 mb-6 flex-grow">
                                    Quick-fire definitions, time complexities, and spot-check questions.
                                </p>
                                <div className="flex items-center text-amber-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Start Quiz <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </Link>

                        {/* Stress Interview */}
                        <Link to="/dashboard/resources/interview/stress" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#ef4444]">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex flex-col h-full">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Users size={28} className="text-red-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Stress Interview</h3>
                                <p className="text-slate-400 mb-6 flex-grow">
                                    Behavioral questions and conflict scenarios to test your soft skills.
                                </p>
                                <div className="flex items-center text-red-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Prepare Now <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            ) : category === 'Aptitude' ? (
                <div className="relative">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            Select Aptitude Domain
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Quantitative Mastery */}
                        <Link to="/dashboard/resources/aptitude/quantitative" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#f59e0b]">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex flex-col h-full">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-amber-400">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Quantitative Mastery</h3>
                                <p className="text-xs text-slate-400 mb-4 flex-grow leading-relaxed">
                                    Arithmetic, Algebra, Geometry, and complex number theory.
                                </p>
                                <div className="flex items-center text-amber-400 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                                    Launch Module <ArrowRight size={14} className="ml-2" />
                                </div>
                            </div>
                        </Link>

                        {/* Logical Inference */}
                        <Link to="/dashboard/resources/aptitude/logical" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#8b5cf6]">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex flex-col h-full">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-violet-400">
                                    <BrainCircuit size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Logical Inference</h3>
                                <p className="text-xs text-slate-400 mb-4 flex-grow leading-relaxed">
                                    Patterns, syllogisms, and deductive reasoning protocols.
                                </p>
                                <div className="flex items-center text-violet-400 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                                    Launch Module <ArrowRight size={14} className="ml-2" />
                                </div>
                            </div>
                        </Link>

                        {/* Verbal Proficiency */}
                        <Link to="/dashboard/resources/aptitude/verbal" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#10b981]">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex flex-col h-full">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Verbal Proficiency</h3>
                                <p className="text-xs text-slate-400 mb-4 flex-grow leading-relaxed">
                                    Linguistic analysis, vocabulary, and semantic reasoning.
                                </p>
                                <div className="flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                                    Launch Module <ArrowRight size={14} className="ml-2" />
                                </div>
                            </div>
                        </Link>

                        {/* Data Analytics */}
                        <Link to="/dashboard/resources/aptitude/data-interpretation" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#06b6d4]">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex flex-col h-full">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-sky-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-cyan-400">
                                    <Code size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Data Analytics</h3>
                                <p className="text-xs text-slate-400 mb-4 flex-grow leading-relaxed">
                                    Statistical interpretation and visual data analysis.
                                </p>
                                <div className="flex items-center text-cyan-400 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                                    Launch Module <ArrowRight size={14} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {resources.map((res, index) => (
                                <ResourceCard key={index} {...res} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed mb-12">
                            <div className="p-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 mb-4 shadow-xl">
                                <BookOpen size={32} className="text-slate-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-300">No resources found</h3>
                            <p className="text-slate-500 mt-2">Checking for updates...</p>
                        </div>
                    )}

                    {category === 'DSA' && (
                        <>
                            {/* DSA Topics Section */}
                            <div className="relative mb-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                                        Practice by Topics
                                    </h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {[
                                        { name: "Arrays", icon: "📊", link: "https://leetcode.com/tag/array/", color: "from-blue-500/20 to-blue-600/10" },
                                        { name: "Two Pointers", icon: "👉", link: "https://leetcode.com/tag/two-pointers/", color: "from-green-500/20 to-green-600/10" },
                                        { name: "Stacks & Queues", icon: "📚", link: "https://leetcode.com/tag/stack/", color: "from-purple-500/20 to-purple-600/10" },
                                        { name: "Backtracking", icon: "🔄", link: "https://leetcode.com/tag/backtracking/", color: "from-red-500/20 to-red-600/10" },
                                        { name: "BST, Heaps & Map", icon: "🌳", link: "https://leetcode.com/tag/binary-search-tree/", color: "from-teal-500/20 to-teal-600/10" },
                                        { name: "Dynamic Programming", icon: "💡", link: "https://leetcode.com/tag/dynamic-programming/", color: "from-amber-500/20 to-amber-600/10" },
                                        { name: "Graphs", icon: "🕸️", link: "https://leetcode.com/tag/graph/", color: "from-indigo-500/20 to-indigo-600/10" },
                                        { name: "Searching", icon: "🔍", link: "https://leetcode.com/tag/binary-search/", color: "from-yellow-500/20 to-yellow-600/10" },
                                        { name: "Linked Lists", icon: "🔗", link: "https://leetcode.com/tag/linked-list/", color: "from-orange-500/20 to-orange-600/10" },
                                        { name: "Hashing", icon: "🔑", link: "https://leetcode.com/tag/hash-table/", color: "from-pink-500/20 to-pink-600/10" },
                                        { name: "Binary Trees", icon: "🌲", link: "https://leetcode.com/tag/binary-tree/", color: "from-emerald-500/20 to-emerald-600/10" },
                                        { name: "Math & Bit Manipulation", icon: "🧮", link: "https://leetcode.com/tag/math/", color: "from-rose-500/20 to-rose-600/10" },
                                        { name: "Greedy Algorithm", icon: "💰", link: "https://leetcode.com/tag/greedy/", color: "from-cyan-500/20 to-cyan-600/10" },
                                        { name: "String & Tries", icon: "📝", link: "https://leetcode.com/tag/string/", color: "from-violet-500/20 to-violet-600/10" },
                                    ].map((topic, index) => (
                                        <a
                                            key={index}
                                            href={topic.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group"
                                        >
                                            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10">
                                                <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                                                <div className="relative flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-2xl">{topic.icon}</div>
                                                        <span className="font-semibold text-slate-200 transition-colors group-hover:text-white">
                                                            {topic.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors">
                                                            0%
                                                        </span>
                                                        <ExternalLink
                                                            size={16}
                                                            className="text-slate-500 transition-all duration-300 group-hover:text-cyan-400 group-hover:translate-x-1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Companies Section */}
                            <div className="relative">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
                                        Target Top Companies
                                    </h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {companies.map((company, index) => (
                                        <CompanyCard key={index} {...company} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Resources;
