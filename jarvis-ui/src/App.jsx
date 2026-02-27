import React, { useState, useCallback } from 'react';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    VoiceAssistantControlBar,
    useVoiceAssistant,
    BarVisualizer,
} from '@livekit/components-react';
import { Mic, MicOff, Power, Shield, Zap, Terminal } from 'lucide-react';

const JARVIS_URL = import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-url';

function App() {
    const [token, setToken] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // In a real production app, you'd fetch this from your backend
    const handleConnect = async () => {
        setIsConnecting(true);
        // For demo purposes, we'll ask the user to provide a token or show a placeholder
        const devToken = prompt("Please enter your LiveKit Token (or leave blank to see UI demo):");
        if (devToken) {
            setToken(devToken);
        } else {
            setIsConnecting(false);
            alert("Demo mode: UI only. To talk to Jarvis, provide a valid LiveKit token.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-jarvis-blue/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-jarvis-blue/5 rounded-full blur-[120px]" />

            {/* Main Container */}
            <div className="z-10 w-full max-w-4xl glass-morphism rounded-3xl p-8 flex flex-col items-center gap-8 shadow-2xl transition-all duration-500 hover:border-jarvis-blue/30">

                {/* Header */}
                <div className="flex items-center gap-3 self-start mb-4">
                    <div className="p-2 bg-jarvis-blue/10 rounded-lg">
                        <Shield className="text-jarvis-blue w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tighter text-white">JARVIS <span className="text-jarvis-blue/60 font-light">SYSTEMS</span></h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-jarvis-blue/50">Tactical Intelligence Interface</p>
                    </div>
                </div>

                {token ? (
                    <LiveKitRoom
                        token={token}
                        serverUrl={JARVIS_URL}
                        connect={true}
                        audio={true}
                        video={false}
                        className="w-full flex flex-col items-center gap-8"
                    >
                        <JarvisVisualizer />
                        <div className="w-full max-w-md">
                            <VoiceAssistantControlBar />
                        </div>
                        <RoomAudioRenderer />
                    </LiveKitRoom>
                ) : (
                    <div className="flex flex-col items-center gap-12 py-10">
                        {/* The Arc Reactor Visual */}
                        <div className="arc-reactor group cursor-pointer" onClick={handleConnect}>
                            <div className="w-16 h-16 bg-jarvis-blue/20 rounded-full flex items-center justify-center group-hover:bg-jarvis-blue/40 transition-colors">
                                <Power className="text-jarvis-blue w-8 h-8 animate-pulse" />
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-3xl font-light mb-2">Systems <span className="text-jarvis-blue font-semibold">Offline</span></h2>
                            <p className="text-gray-400 text-sm max-w-xs">Waiting for tactical authorization to initialize the Jarvis neural link.</p>
                        </div>

                        <button
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="px-8 py-3 bg-jarvis-blue/10 border border-jarvis-blue/50 rounded-full hover:bg-jarvis-blue/20 transition-all active:scale-95 flex items-center gap-2 group"
                        >
                            <Zap className={`w-4 h-4 ${isConnecting ? 'animate-bounce' : 'group-hover:text-jarvis-blue'}`} />
                            <span className="text-sm font-medium tracking-wide">INITIALIZE LINK</span>
                        </button>
                    </div>
                )}

                {/* Footer Stats */}
                <div className="grid grid-cols-3 gap-8 w-full border-t border-white/5 pt-6 mt-4">
                    <Stat icon={<Terminal className="w-3 h-3" />} label="Core" value="Gemini 2.0" />
                    <Stat icon={<Zap className="w-3 h-3" />} label="Latency" value="~120ms" />
                    <Stat icon={<Shield className="w-3 h-3" />} label="Security" value="Encrypted" />
                </div>
            </div>

            {/* Side Decorative Scanners */}
            <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 opacity-20">
                <div className="h-64 w-[2px] bg-gradient-to-b from-transparent via-jarvis-blue to-transparent" />
            </div>
        </div>
    );
}

function JarvisVisualizer() {
    const { state } = useVoiceAssistant();

    return (
        <div className="flex flex-col items-center gap-6">
            <div className={`arc-reactor ${state === 'speaking' ? 'glow-blue' : ''}`}>
                <BarVisualizer className="w-32 h-32 text-jarvis-blue" />
            </div>
            <div className="text-jarvis-blue font-mono text-xs uppercase tracking-widest animate-pulse">
                {state === 'speaking' ? 'Jarvis Speaking...' : state === 'listening' ? 'Listening...' : 'Systems Standby'}
            </div>
        </div>
    );
}

function Stat({ icon, label, value }) {
    return (
        <div className="flex flex-col gap-1 items-center">
            <div className="flex items-center gap-1.5 text-gray-500">
                {icon}
                <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-xs font-semibold text-jarvis-blue/80">{value}</span>
        </div>
    );
}

export default App;
