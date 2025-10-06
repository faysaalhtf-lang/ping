
import React from 'react';
import Button from './Button';
import { ArrowUpIcon } from './Icons';

const HistoryPage: React.FC = () => {
  const historyData = [
    { date: '2024-07-29 10:45 AM', download: '254.8', upload: '98.2', ping: '12', isp: 'Comcast' },
    { date: '2024-07-28 08:12 PM', download: '189.3', upload: '85.1', ping: '15', isp: 'Comcast' },
    { date: '2024-07-27 11:30 AM', download: '210.5', upload: '90.4', ping: '11', isp: 'Comcast' },
    { date: '2024-07-26 09:00 PM', download: '150.1', upload: '75.6', ping: '18', isp: 'Comcast' },
    { date: '2024-07-25 02:20 PM', download: '188.7', upload: '88.9', ping: '14', isp: 'Comcast' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-24 max-w-5xl">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Speed Test History</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
                <select className="bg-light-card dark:bg-dark-card border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200">
                    <option>Sort By: Date (Newest)</option>
                </select>
                <select className="bg-light-card dark:bg-dark-card border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>All Time</option>
                </select>
            </div>
            <div className="bg-light-card dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5">
                        <tr>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Download (Mbps)</th>
                            <th className="p-4">Upload (Mbps)</th>
                            <th className="p-4">Ping (ms)</th>
                            <th className="p-4">ISP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.map((item, index) => (
                            <tr key={index} className="border-t border-gray-200 dark:border-white/10">
                                <td className="p-4">{item.date}</td>
                                <td className="p-4 text-neon-blue">{item.download}</td>
                                <td className="p-4 text-neon-magenta">{item.upload}</td>
                                <td className="p-4">{item.ping}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400">{item.isp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="bg-light-card dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg">
            <h3 className="text-gray-500 dark:text-gray-400 text-lg">Average Download</h3>
            <p className="text-5xl font-bold my-2 text-gray-900 dark:text-white">198.2 <span className="text-2xl">Mbps</span></p>
            <div className="flex items-center text-green-500 dark:text-green-400">
                <ArrowUpIcon className="w-5 h-5 mr-1" />
                <span>+5.2% vs last week</span>
            </div>
            <Button variant="secondary" className="mt-6 w-full">View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;