import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  Bug,
  Lightbulb
} from 'lucide-react';

const faqs = [
  {
    category: "Getting Started",
    question: "How do I connect my LeetCode and CodeChef accounts?",
    answer: "Go to your Profile tab, click on 'Connect' next to the platform, and enter your exact handle/username. Our system will automatically fetch your public stats."
  },
  {
    category: "Getting Started",
    question: "Is TrackCode AI completely free?",
    answer: "Yes! All core tracking features, contest alerts, AI roadmap generation, and resume analytics are completely free to use."
  },
  {
    category: "Data Sync",
    question: "Why is my contest rating or solved count not updating immediately?",
    answer: "Platform APIs and scrapers sync periodically (usually every few hours). If you just finished a contest or solved a problem, please allow some time for the platform to finalize official ratings and our system to update."
  },
  {
    category: "Data Sync",
    question: "Can I manually force a sync for my profile data?",
    answer: "When you navigate to your Profile tab or refresh your platform profiles, our system automatically initiates a fresh fetch from the connected platforms."
  },
  {
    category: "AI Features",
    question: "How does the AI Resume Analytics score my resume?",
    answer: "Resume Analytics uses the Groq AI engine to extract text from your uploaded PDF. It evaluates ATS compatibility, identifies missing keywords, checks formatting, and calculates an interview probability score based on industry standards."
  },
  {
    category: "AI Features",
    question: "Can I save multiple AI Roadmaps?",
    answer: "Yes, when you generate a roadmap in the Roadmap tab, you can give it a title and save it. All saved roadmaps appear in your sidebar history so you can track progress over time."
  },
  {
    category: "Interviews & Quizzes",
    question: "What is the difference between Technical and Stress Interviews?",
    answer: "Technical Interviews focus on standard DSA problem solving with whiteboard explanation. Stress Interviews simulate high-pressure scenarios with rapid follow-up questions and strict time constraints to build interview resilience."
  },
  {
    category: "Interviews & Quizzes",
    question: "How are Aptitude Quiz scores calculated?",
    answer: "Quizzes consist of timed multiple-choice questions across Quantitative, Logical, and Verbal domains. Instant feedback and explanations are provided after submission."
  },
  {
    category: "Notifications",
    question: "How do contest notifications work?",
    answer: "Our system continuously monitors upcoming contests on LeetCode, CodeChef, Codeforces, and AtCoder. You will see registration alerts and reminders in the Notifications tab."
  },
  {
    category: "Security",
    question: "Are my passwords and account credentials secure?",
    answer: "We use Firebase Authentication for secure login and encryption. We only store your public platform handles (like LeetCode username) to fetch public stats—we never ask for or store your coding platform passwords."
  }
];

const systemStatus = [
  { name: 'TrackCode Core', status: 'operational' },
  { name: 'LeetCode Sync', status: 'operational' },
  { name: 'Codeforces Sync', status: 'operational' },
  { name: 'CodeChef Sync', status: 'delayed' },
  { name: 'AtCoder Sync', status: 'operational' }
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketType, setTicketType] = useState('bug'); // bug, feature, help
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="text-cyan-400" /> Help & Support
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Need assistance? Find answers or reach out to our team.
        </p>
      </div>

      {/* Top Search Bar */}
      <div className="relative mb-10 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: FAQs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-fuchsia-400" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors gap-4"
                  >
                    <div>
                      <span className="inline-block text-[10px] font-semibold text-cyan-400/80 uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                        {faq.category}
                      </span>
                      <div className="text-sm font-medium text-slate-200">{faq.question}</div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`px-5 text-sm text-slate-400 transition-all duration-300 ease-in-out ${openFaq === index ? 'pb-4 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="pt-3 border-t border-white/5 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-slate-400 text-sm">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status & Contact */}
        <div className="space-y-8">
          
          {/* System Status */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-3">
              {systemStatus.map((sys, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{sys.name}</span>
                  <div className="flex items-center gap-1.5">
                    {sys.status === 'operational' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                        <span className="text-xs text-emerald-400">Operational</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                        <span className="text-xs text-amber-400">Delayed</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Contact Support</h3>
            <p className="text-xs text-slate-400 mb-5">We usually respond within 24 hours.</p>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-sm font-medium text-white mb-1">Message Sent!</h4>
                <p className="text-xs text-slate-400">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setTicketType('bug')} className={`py-2 px-1 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-all ${ticketType === 'bug' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                    <Bug className="w-4 h-4" /> Bug
                  </button>
                  <button type="button" onClick={() => setTicketType('feature')} className={`py-2 px-1 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-all ${ticketType === 'feature' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                    <Lightbulb className="w-4 h-4" /> Feature
                  </button>
                  <button type="button" onClick={() => setTicketType('help')} className={`py-2 px-1 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-all ${ticketType === 'help' ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                    <HelpCircle className="w-4 h-4" /> Help
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">Describe your issue</label>
                  <textarea 
                    required
                    rows="4"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-colors custom-scrollbar"
                    placeholder={ticketType === 'bug' ? "What went wrong?" : ticketType === 'feature' ? "What should we add?" : "How can we help?"}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:opacity-90 text-slate-950 font-semibold py-2.5 rounded-xl transition-opacity disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Help;
