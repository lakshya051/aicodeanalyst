import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Network, GitMerge, Package } from 'lucide-react';

const TabButton = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
    }`}
  >
    {icon}
    {label}
  </button>
);

function VisualizationDashboard({ vizData }) {
  const [activeTab, setActiveTab] = useState('imports');

  if (!vizData) return null;

  const importData = vizData.imports.map(imp => ({ name: imp, count: 1 }));

  return (
    <div className="mb-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-400" />
          Code Visualization
        </h3>
        <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-lg">
          <TabButton label="Imports" icon={<Package size={16} />} isActive={activeTab === 'imports'} onClick={() => setActiveTab('imports')} />
          <TabButton label="Function Calls" icon={<GitMerge size={16} />} isActive={activeTab === 'calls'} onClick={() => setActiveTab('calls')} />
        </div>
      </div>

      <div className="h-64 w-full">
        {activeTab === 'imports' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={importData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} />
              <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
              <Bar dataKey="count" fill="#818cf8" name="Imported" />
            </BarChart>
          </ResponsiveContainer>
        )}
        {activeTab === 'calls' && (
          <div className="text-slate-400 p-4 text-center">
            <p>Function Call Graph</p>
            {vizData.function_calls.edges.length > 0 ? (
              <ul className="text-left mt-4 text-sm font-mono">
                {vizData.function_calls.edges.map((edge, i) => (
                  <li key={i} className="mb-1">
                    <span className="text-purple-400">{edge.source}</span>
                    <span className="text-slate-500"> </span>
                    <span className="text-cyan-400">{edge.target}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4">No internal function calls were found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VisualizationDashboard;