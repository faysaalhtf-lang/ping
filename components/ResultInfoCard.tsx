import React from 'react';

interface ResultInfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    unit: string;
    colorClass: string;
}

const ResultInfoCard: React.FC<ResultInfoCardProps> = ({ icon, title, value, unit, colorClass }) => (
    <div className="flex items-center space-x-4 p-4 bg-light-card dark:bg-dark-card rounded-lg border border-gray-200 dark:border-white/10">
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value} <span className="text-lg text-gray-600 dark:text-gray-300">{unit}</span>
            </p>
        </div>
    </div>
);

export default ResultInfoCard;