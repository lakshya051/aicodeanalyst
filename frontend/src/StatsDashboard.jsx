import React from 'react';
import { Sigma, Pilcrow, FileText, BarChart2 } from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-slate-700 p-4 rounded-lg flex items-center gap-4 shadow-md">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

function StatsDashboard({ stats }) {
  if (!stats) return null;

  return (
    <div className="mb-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-cyan-400" />
        Code Analysis
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          icon={<FileText className="w-5 h-5" />} 
          label="Lines of Code" 
          value={stats.line_count} 
          color="bg-blue-500/20 text-blue-300" 
        />
        <StatCard 
          icon={<Pilcrow className="w-5 h-5" />} 
          label="Characters" 
          value={stats.char_count.toLocaleString()} 
          color="bg-purple-500/20 text-purple-300" 
        />
        <StatCard 
          icon={<Sigma className="w-5 h-5" />} 
          label="Est. Complexity" 
          value={stats.complexity_score} 
          color="bg-amber-500/20 text-amber-300" 
        />
      </div>
    </div>
  );
}

export default StatsDashboard;