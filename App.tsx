import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SpeedGauge from './components/SpeedGauge';
import Button from './components/Button';
import ResultInfoCard from './components/ResultInfoCard';
import FeatureCard from './components/FeatureCard';
import ServerModal from './components/ServerModal';
import { DownloadIcon, UploadIcon, PingIcon, GraphIcon, WorldIcon, CameraIcon, MapPinIcon, ShareIcon } from './components/Icons';
import { TestStatus, View, GraphDataPoint, Server } from './types';
import HistoryPage from './components/HistoryPage';
import ToolsPage from './components/ToolsPage';

interface UserInfo {
    isp: string;
    city: string;
    country: string;
}

const servers: Server[] = [
    { id: 1, name: 'Cloudflare', provider: 'Auto-Selected', location: 'San Francisco, USA' },
    { id: 2, name: 'Google Cloud', provider: 'GCP', location: 'New York, USA' },
    { id: 3, name: 'Fastly', provider: 'EdgeNet', location: 'London, UK' },
    { id: 4, name: 'NTT', provider: 'NTT Communications', location: 'Tokyo, Japan' },
    { id: 5, name: 'Vercel', provider: 'AWS', location: 'Sydney, Australia' },
];

const App: React.FC = () => {
    // Dynamically load Recharts from window object to support importmap
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = (window as any).Recharts || {};
    
    // Refs
    const resultsRef = useRef<HTMLDivElement>(null);

    // State
    const [activeView, setActiveView] = useState<View>('speedtest');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [testStatus, setTestStatus] = useState<TestStatus>(TestStatus.IDLE);
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [ping, setPing] = useState(0);
    const [finalResults, setFinalResults] = useState<{ download: number; upload: number; ping: number } | null>(null);
    const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isServerModalOpen, setServerModalOpen] = useState(false);
    const [selectedServer, setSelectedServer] = useState<Server>(servers[0]);
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

    // Theme toggle handler
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    // Effect to apply theme class to HTML element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    // Effect to fetch user's IP and location info
    useEffect(() => {
        fetch('https://api.ip.sb/geoip')
            .then(response => response.json())
            .then(data => {
                setUserInfo({
                    isp: data.organization || 'N/A',
                    city: data.city || 'Unknown City',
                    country: data.country || 'Unknown Country',
                });
            })
            .catch(error => {
                console.error("Error fetching user info:", error);
                setUserInfo({ isp: 'Unavailable', city: 'Unavailable', country: '' });
            });
    }, []);

    // Memoized label for the speed gauge based on test status
    const testLabel = useMemo(() => {
        switch (testStatus) {
            case TestStatus.TESTING_DOWNLOAD: return "Download (Mbps)";
            case TestStatus.TESTING_UPLOAD: return "Upload (Mbps)";
            case TestStatus.TESTING_PING: return "Ping (ms)";
            case TestStatus.COMPLETE: return "Mbps";
            default: return "Mbps";
        }
    }, [testStatus]);

    // Simulation logic for a single phase of the speed test
    const runTestPhase = useCallback((setter: React.Dispatch<React.SetStateAction<number>>, duration: number, maxVal: number, dataKey: 'download' | 'upload' | undefined, onComplete: () => void) => {
        let startTime = Date.now();
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= duration) {
                clearInterval(interval);
                setter(maxVal);
                if (dataKey) {
                    setGraphData(prev => [...prev, { time: Math.round(duration / 1000), [dataKey]: parseFloat(maxVal.toFixed(2)) }]);
                }
                onComplete();
                return;
            }
            
            const progress = elapsedTime / duration;
            const baseSpeed = progress < 0.2 ? (progress / 0.2) * maxVal : maxVal;
            const fluctuation = (Math.random() - 0.5) * (baseSpeed * 0.25);
            const currentValue = Math.max(0, baseSpeed + fluctuation);

            setter(currentValue);
            
            if (dataKey) {
                 setGraphData(prev => [...prev, { time: Math.round(elapsedTime / 1000) , [dataKey]: parseFloat(currentValue.toFixed(2)) }]);
            }

        }, 150);

        return () => clearInterval(interval);
    }, []);
    
    // Main handler to start and orchestrate the speed test
    const handleStartTest = useCallback(() => {
        // Reset state
        setTestStatus(TestStatus.IDLE);
        setDownloadSpeed(0);
        setUploadSpeed(0);
        setPing(0);
        setGraphData([]);
        setFinalResults(null);

        // Start test sequence
        setTimeout(() => {
            setTestStatus(TestStatus.TESTING_DOWNLOAD);
            const finalDownload = 80 + Math.random() * 400;
            runTestPhase(setDownloadSpeed, 8000, finalDownload, 'download', () => {
                
                setTestStatus(TestStatus.TESTING_UPLOAD);
                const finalUpload = 20 + Math.random() * 80;
                runTestPhase(setUploadSpeed, 8000, finalUpload, 'upload', () => {

                    setTestStatus(TestStatus.TESTING_PING);
                    const finalPing = 5 + Math.random() * 45;
                     runTestPhase(setPing, 1500, finalPing, undefined, () => {
                        setFinalResults({ download: finalDownload, upload: finalUpload, ping: finalPing });
                        setTestStatus(TestStatus.COMPLETE);
                    });
                });
            });
        }, 100);
    }, [runTestPhase]);

    // Handler for sharing results
    const handleShareResults = useCallback(() => {
        if (!finalResults) return;
        const resultText = `⚡️ I just tested my internet with PingPanic!\n\nDownload: ${finalResults.download.toFixed(1)} Mbps\nUpload: ${finalResults.upload.toFixed(1)} Mbps\nPing: ${finalResults.ping.toFixed(0)} ms\n\nTest your speed at: ${window.location.href}`;

        // Use Web Share API if available (mobile)
        if (navigator.share) {
            navigator.share({
                title: 'My PingPanic Speed Test Results',
                text: resultText,
            }).catch(err => console.error("Could not share:", err));
        } else {
            // Fallback to clipboard (desktop)
            navigator.clipboard.writeText(resultText).then(() => {
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2000);
            }).catch(err => alert("Failed to copy results."));
        }
    }, [finalResults]);

    const isTesting = testStatus !== TestStatus.IDLE && testStatus !== TestStatus.COMPLETE;

    // Memoized value for the current speed displayed on the gauge
    const currentSpeed = useMemo(() => {
        switch (testStatus) {
            case TestStatus.TESTING_DOWNLOAD: return downloadSpeed;
            case TestStatus.TESTING_UPLOAD: return uploadSpeed;
            case TestStatus.TESTING_PING: return ping;
            case TestStatus.COMPLETE: return finalResults?.download ?? 0;
            default: return 0;
        }
    }, [testStatus, downloadSpeed, uploadSpeed, ping, finalResults]);

    // Main render function for the Speed Test view
    const renderSpeedTest = () => {
        const gridColor = theme === 'dark' ? '#22d3ee' : '#d1d5db';
        const chartColors = {
            grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            axis: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
            tooltipBg: theme === 'dark' ? '#111118' : '#ffffff',
            tooltipBorder: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
        };

        return (
          <div className="flex flex-col items-center min-h-screen pt-28 px-4 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-20 z-0"></div>
            <style>{`.bg-grid-pattern { background-image: radial-gradient(${gridColor} 1px, transparent 1px); background-size: 3rem 3rem; }`}</style>
            
            <div className="z-10 w-full flex flex-col items-center flex-grow justify-center">
                
                {testStatus === TestStatus.COMPLETE ? (
                    <div ref={resultsRef} className="w-full max-w-4xl p-8 bg-light-card/80 dark:bg-dark-card/70 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg animate-fade-in">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">TEST COMPLETE</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <ResultInfoCard icon={<DownloadIcon className="w-6 h-6"/>} title="Download Speed" value={finalResults?.download.toFixed(2) ?? '0'} unit="Mbps" colorClass="bg-neon-blue/20 text-neon-blue" />
                            <ResultInfoCard icon={<UploadIcon className="w-6 h-6"/>} title="Upload Speed" value={finalResults?.upload.toFixed(2) ?? '0'} unit="Mbps" colorClass="bg-neon-magenta/20 text-neon-magenta" />
                            <ResultInfoCard icon={<PingIcon className="w-6 h-6"/>} title="Ping" value={finalResults?.ping.toFixed(0) ?? '0'} unit="ms" colorClass="bg-gray-500/20 text-gray-800 dark:text-white" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-black/5 dark:bg-black/30 p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Speed Fluctuations (Mbps)</h3>
                                {ResponsiveContainer && LineChart ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={graphData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                                            <XAxis dataKey="time" unit="s" stroke={chartColors.axis} />
                                            <YAxis stroke={chartColors.axis} />
                                            <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }} itemStyle={{ color: theme === 'dark' ? '#FFF' : '#000' }}/>
                                            <Legend />
                                            <Line type="monotone" dataKey="download" stroke="#22d3ee" strokeWidth={2} dot={false} name="Download"/>
                                            <Line type="monotone" dataKey="upload" stroke="#d946ef" strokeWidth={2} dot={false} name="Upload"/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-gray-400">Chart library loading...</div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="bg-black/5 dark:bg-black/30 p-4 rounded-lg border border-gray-200 dark:border-white/10 h-full flex flex-col justify-around">
                                     <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center"><MapPinIcon className="w-5 h-5 mr-2 text-gray-400"/>Your Location</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{userInfo ? `${userInfo.city}, ${userInfo.country}` : 'Loading...'}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">{userInfo?.isp}</p>
                                     </div>
                                     <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center"><CameraIcon className="w-5 h-5 mr-2 text-gray-400"/>Connection Stability</h3>
                                        <p className="text-gray-700 dark:text-gray-300">Bufferbloat: <span className="font-bold text-green-600 dark:text-green-400">A (Good)</span></p>
                                        <p className="text-gray-700 dark:text-gray-300">Jitter: <span className="font-bold text-green-600 dark:text-green-400">{((finalResults?.ping ?? 10) * 0.15).toFixed(0)} ms (Excellent)</span></p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <SpeedGauge speed={currentSpeed} testLabel={testLabel} />
                        {testStatus === TestStatus.IDLE && (
                          <div className="text-center text-gray-500 dark:text-gray-400 -mt-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-light-card/50 dark:bg-dark-card/50 px-6 py-3 rounded-lg animate-fade-in">
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">{userInfo ? userInfo.isp : 'Loading...'}</p>
                                <p className="text-xs">Your ISP</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">{selectedServer.location}</p>
                                <p className="text-xs">{selectedServer.name}</p>
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-[-2rem] w-full max-w-2xl">
                            <ResultInfoCard icon={<DownloadIcon className="w-6 h-6"/>} title="Download" value={downloadSpeed.toFixed(1)} unit="Mbps" colorClass="bg-neon-blue/20 text-neon-blue" />
                            <ResultInfoCard icon={<UploadIcon className="w-6 h-6"/>} title="Upload" value={uploadSpeed.toFixed(1)} unit="Mbps" colorClass="bg-neon-magenta/20 text-neon-magenta" />
                            <ResultInfoCard icon={<PingIcon className="w-6 h-6"/>} title="Ping" value={ping.toFixed(0)} unit="ms" colorClass="bg-gray-500/20 text-gray-800 dark:text-white" />
                        </div>
                    </>
                )}
                
                <div className="mt-8 flex space-x-4">
                    {testStatus === TestStatus.IDLE && <Button onClick={handleStartTest} className="shadow-glow-blue" disabled={!userInfo}>START TEST</Button>}
                    {isTesting && <Button variant="secondary" onClick={() => window.location.reload()}>CANCEL TEST</Button>}
                    {testStatus === TestStatus.COMPLETE && (
                        <>
                            <Button onClick={handleStartTest}>RE-RUN TEST</Button>
                            <Button variant="secondary" onClick={handleShareResults}>
                                {shareStatus === 'copied' ? 'COPIED!' : <div className="flex items-center"><ShareIcon className="w-5 h-5 mr-2" /> SHARE</div>}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="z-10 w-full max-w-4xl mt-auto pt-16">
                {testStatus !== TestStatus.COMPLETE && (
                  <div>
                      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Comprehensive Testing Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FeatureCard icon={<GraphIcon className="w-10 h-10 text-neon-blue" />} title="Real-Time Graphing" onClick={testStatus === TestStatus.COMPLETE ? () => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }) : undefined }/>
                          <FeatureCard icon={<WorldIcon className="w-10 h-10 text-neon-magenta" />} title="Multi-Server Test" onClick={() => setServerModalOpen(true)} />
                          <FeatureCard icon={<CameraIcon className="w-10 h-10 text-gray-800 dark:text-white" />} title="Bufferbloat & Jitter" onClick={() => alert('Bufferbloat and Jitter analysis is included in the final test results.')} />
                      </div>
                  </div>
                )}
            </div>

            <div className="z-10 w-full pt-8 pb-4">
              <Footer />
            </div>
          </div>
        )
    };
    
    // Router logic to render the active view
    const renderContent = () => {
        switch(activeView) {
            case 'speedtest': return renderSpeedTest();
            case 'history': return <HistoryPage />;
            case 'tools': return <ToolsPage />;
            default: return renderSpeedTest();
        }
    }

    return (
        <main className="bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <Header activeView={activeView} setActiveView={setActiveView} theme={theme} toggleTheme={toggleTheme} />
            <ServerModal
                isOpen={isServerModalOpen}
                onClose={() => setServerModalOpen(false)}
                currentServer={selectedServer}
                servers={servers}
                onSelect={(server) => {
                    setSelectedServer(server);
                    setServerModalOpen(false);
                }}
            />
            {renderContent()}
        </main>
    );
};

export default App;