import React, { useState } from 'react';
import { SnippetMode } from './SnippetMode';
import { PublicRepoMode } from './PublicRepoMode';
import { Github, Pencil } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('snippet'); // 'snippet' or 'repo'

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
            AI Code Analyst
          </h1>
          <p className="text-slate-400 mt-4">
            Analyze code snippets or entire public GitHub repositories.
          </p>
        </header>

        <div className="flex justify-center items-center gap-2 p-2 bg-slate-800/50 rounded-xl max-w-sm mx-auto">
          <button
            onClick={() => setMode('snippet')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
              mode === 'snippet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Pencil size={16} /> Snippet Sandbox
          </button>
          <button
            onClick={() => setMode('repo')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
              mode === 'repo' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Github size={16} /> Public Repository
          </button>
        </div>

        {mode === 'snippet' ? <SnippetMode /> : <PublicRepoMode />}
      </div>
    </div>
  );
}

export default App;
