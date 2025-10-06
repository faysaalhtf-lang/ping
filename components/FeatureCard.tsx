import React from 'react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, onClick }) => (
    <button
        onClick={onClick}
        disabled={!onClick}
        className="bg-light-card dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-md dark:shadow-glow-white text-center transition-all hover:scale-105 hover:border-neon-blue/50 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-gray-200 dark:disabled:hover:border-white/10"
    >
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
    </button>
);

export default FeatureCard;