import React, { useRef, useEffect, useState } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { useNavigate } from 'react-router-dom';

const LiveInterview = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    
    const [stream, setStream] = useState(null);
    const [cameraError, setCameraError] = useState(false);
    const [questions, setQuestions] = useState([
        {
            title: "Loading...",
            content: "AI is crafting your challenges...",
            example: "Please wait..."
        }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isEraser, setIsEraser] = useState(false);
    const [strokeColor, setStrokeColor] = useState('#000000');
    
    // Timer State (45 minutes in seconds)
    const [timeLeft, setTimeLeft] = useState(45 * 60);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const fetchProblems = async () => {
        console.log("Fetching new whiteboard problems from AI...");
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/interview/generate-whiteboard-problem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: 'Trees, Graphs, and System Design' })
            });
            const data = await response.json();
            if (data.questions && data.questions.length > 0) {
                setQuestions(data.questions);
                setCurrentIndex(0);
            } else {
                throw new Error("Invalid AI response");
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
            setQuestions([
                {
                    title: "Two Sum Problem",
                    content: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
        
        let mediaStream = null;
        const startCamera = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error("Error accessing media devices.", error);
                setCameraError(true);
            }
        };

        startCamera();

        // Timer Interval
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            clearInterval(timer);
        };
    }, []);

    const handleEndInterview = () => {
        if (window.confirm("Are you sure you want to end the interview session?")) {
            navigate('/dashboard/resources/interview');
        }
    };

    const handleEraserToggle = () => {
        setIsEraser(!isEraser);
        canvasRef.current?.eraseMode(!isEraser);
    };

    const handleClear = () => canvasRef.current?.clearCanvas();

    const nextProblem = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevProblem = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const currentProblem = questions[currentIndex];

    return (
        <div className="flex flex-col bg-slate-950 h-[calc(100vh-20px)] p-4 md:p-6 gap-4 overflow-hidden">
            {/* Minimal Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20" />
                    <h1 className="text-xl font-bold text-white tracking-tight">AI Live Interview</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Remaining Time</span>
                        <span className={`text-xl font-mono font-bold tracking-wider ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <button 
                        onClick={handleEndInterview}
                        className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
                    >
                        End Interview
                    </button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="flex-grow grid grid-cols-12 gap-6 overflow-hidden">
                {/* Left Sidebar: Camera & Questions */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                    {/* Camera Feed */}
                    <div className="relative aspect-video lg:aspect-auto lg:h-1/3 rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl shrink-0">
                        {stream ? (
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500 text-xs italic text-center p-4">
                                {cameraError ? "Camera Access Denied. Please enable camera." : "Establishing secure link..."}
                            </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/5 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            Live Feed
                        </div>
                    </div>

                    {/* Question Panel */}
                    <div className="flex-grow flex flex-col bg-slate-900/50 border border-white/10 rounded-3xl p-6 overflow-hidden backdrop-blur-sm relative">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <div className="flex items-center gap-2 text-cyan-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Challenge {currentIndex + 1} of {questions.length}</h2>
                            </div>
                            <button onClick={fetchProblems} title="Regenerate all" className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            </button>
                        </div>
                        
                        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                            {isLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-8 bg-white/5 rounded-lg w-3/4"></div>
                                    <div className="h-20 bg-white/5 rounded-xl"></div>
                                    <div className="h-32 bg-white/5 rounded-xl"></div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">{currentProblem.title}</h3>
                                    <div className="space-y-4">
                                        <p className="text-slate-300 text-sm leading-relaxed">{currentProblem.content}</p>
                                        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Example Case</p>
                                            <pre className="font-mono text-xs text-cyan-400 whitespace-pre-wrap">
                                                {typeof currentProblem.example === 'string' 
                                                    ? currentProblem.example 
                                                    : JSON.stringify(currentProblem.example, null, 2)
                                                }
                                            </pre>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-2 shrink-0">
                            <button 
                                onClick={prevProblem}
                                disabled={currentIndex === 0 || isLoading}
                                className={`flex-1 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl border transition-all ${
                                    currentIndex === 0 || isLoading 
                                    ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed' 
                                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10 active:scale-95'
                                }`}
                            >
                                Previous
                            </button>
                            <button 
                                onClick={nextProblem}
                                disabled={currentIndex === questions.length - 1 || isLoading}
                                className={`flex-1 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl border transition-all ${
                                    currentIndex === questions.length - 1 || isLoading 
                                    ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed' 
                                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10 active:scale-95'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Whiteboard */}
                <div className="col-span-12 lg:col-span-8 flex flex-col bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-2xl">
                        <button 
                            onClick={() => { setStrokeColor('#000000'); setIsEraser(false); canvasRef.current?.eraseMode(false); }}
                            className={`p-2 rounded-xl transition-all ${!isEraser ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                        <button 
                            onClick={handleEraserToggle}
                            className={`p-2 rounded-xl transition-all ${isEraser ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-1"></div>
                        <div className="flex items-center gap-1.5 px-2">
                            {['#000000', '#2563eb', '#dc2626', '#16a34a'].map(color => (
                                <button 
                                    key={color}
                                    onClick={() => { setStrokeColor(color); setIsEraser(false); canvasRef.current?.eraseMode(false); }}
                                    className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${strokeColor === color ? 'border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <div className="w-px h-6 bg-white/10 mx-1"></div>
                        <button onClick={() => canvasRef.current?.undo()} className="p-2 text-slate-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg></button>
                        <button onClick={handleClear} className="p-2 text-slate-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    </div>

                    <div className="flex-grow bg-white relative">
                        <ReactSketchCanvas
                            ref={canvasRef}
                            strokeWidth={4}
                            strokeColor={strokeColor}
                            canvasColor="#ffffff"
                            className="cursor-crosshair w-full h-full"
                        />
                        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveInterview;
