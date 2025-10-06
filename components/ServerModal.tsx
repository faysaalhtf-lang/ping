import React from 'react';
import type { Server } from '../types';
import { XIcon, ServerIcon } from './Icons';

interface ServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (server: Server) => void;
    currentServer: Server;
    servers: Server[];
}

const ServerModal: React.FC<ServerModalProps> = ({ isOpen, onClose, onSelect, currentServer, servers }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-light-card dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-xl shadow-lg p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select a Server</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-2">
                    {servers.map(server => (
                        <button
                            key={server.id}
                            onClick={() => onSelect(server)}
                            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                currentServer.id === server.id
                                    ? 'bg-neon-blue/20 text-neon-blue'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                        >
                            <ServerIcon className="w-6 h-6 mr-4" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{server.location}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{server.name} ({server.provider})</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServerModal;
