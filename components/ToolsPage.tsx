
import React from 'react';
import Button from './Button';
import { SearchIcon, BuildingIcon, CameraIcon, LightbulbIcon, WorldIcon } from './Icons';

const ToolCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-light-card dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col shadow-lg transition-all hover:border-neon-blue/50 dark:hover:shadow-glow-blue">
        <div className="flex items-center mb-4">
            <div className="text-neon-blue mr-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);

const ToolsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8 mt-24 max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Essential Network Tools & Diagnostics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col items-center justify-center h-full">
                    <WorldIcon className="w-full max-w-md h-auto text-gray-200 dark:text-white/10" />
                     <p className="text-center text-gray-500 dark:text-gray-400 mt-2">World map indicating server locations.</p>
                    <Button className="mt-4">SELECT SERVERS</Button>
                </div>
                <div className="space-y-6">
                    <ToolCard icon={<SearchIcon className="w-8 h-8"/>} title="Network Diagnostics">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Run in-depth diagnostics to troubleshoot your connection.</p>
                        <Button variant="secondary" className="w-full">RUN DIAGNOSTICS</Button>
                    </ToolCard>
                    <ToolCard icon={<BuildingIcon className="w-8 h-8"/>} title="ISP Comparison">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Compare internet service providers in your area.</p>
                        <div className="flex space-x-2">
                           <input type="text" placeholder="Enter ZIP code" className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200"/>
                           <Button variant="secondary">COMPARE</Button>
                        </div>
                    </ToolCard>
                    <ToolCard icon={<CameraIcon className="w-8 h-8"/>} title="Bufferbloat & Jitter">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Analyze your connection for stability issues affecting streaming and gaming.</p>
                        <Button variant="secondary" className="w-full">ANALYZE NOW</Button>
                    </ToolCard>
                     <ToolCard icon={<LightbulbIcon className="w-8 h-8"/>} title="Learn About Metrics">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Understand what download, upload, ping, and other metrics mean.</p>
                        <Button variant="secondary" className="w-full">READ MORE</Button>
                    </ToolCard>
                </div>
            </div>
        </div>
    );
};

export default ToolsPage;
