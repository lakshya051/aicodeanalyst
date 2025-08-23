import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Bot, LoaderCircle, CornerDownLeft, User, Github } from 'lucide-react';
import CodeViewer from './CodeViewer'; // Import the new component

export function GitHubMode() {
  const [accessToken, setAccessToken] = useState(null);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // New state for the code viewer modal
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    fileContent: '',
    language: 'js',
    line: null,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      setAccessToken(token);
      window.history.pushState({}, document.title, "/");
    }
  }, []);

  const handleGetRepos = async () => { /* ... (no changes here) ... */ };
  const handleAnalyzeRepo = async () => { /* ... (no changes here) ... */ };
  
  const handleSendMessage = async () => {
    if (!userInput || isLoading) return;
    const newUserMessage = { role: 'user', parts: [userInput] };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/repo_chat', { question: userInput });
      const aiReply = { role: 'model', parts: [response.data.reply] };
      setMessages([...newMessages, aiReply]);
    } catch (error) {
      console.error("Error in repo chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = async (filePath, lineNumber) => {
    // This function fetches file content from GitHub and opens the viewer
    try {
      const contentUrl = `https://api.github.com/repos/${selectedRepo.split('/').slice(-2).join('/')}/contents/${filePath}`;
      const response = await axios.get(contentUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const fileContent = atob(response.data.content); // Decode from base64
      const language = filePath.split('.').pop();
      
      setViewerState({
        isOpen: true,
        fileContent,
        language,
        line: lineNumber,
      });
    } catch (error) {
      console.error("Failed to fetch file content:", error);
      alert(`Could not load file: ${filePath}`);
    }
  };

  const renderers = {
    a: ({ href, children }) => {
      // Custom renderer for links
      const match = /\[(.*):(\d+)\]/.exec(children[0]);
      if (match) {
        const [_, filePath, lineNumber] = match;
        return (
          <button
            onClick={() => handleCitationClick(filePath, parseInt(lineNumber))}
            className="bg-indigo-600/50 text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/50 transition-colors text-sm font-mono"
          >
            {children}
          </button>
        );
      }
      return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
  };

  // ... (rest of the component JSX is mostly the same)
  
  return (
    <>
      {viewerState.isOpen && (
        <CodeViewer 
          fileContent={viewerState.fileContent}
          language={viewerState.language}
          highlightedLine={viewerState.line}
          onClose={() => setViewerState({ ...viewerState, isOpen: false })}
        />
      )}
      {/* ... (Your existing component JSX from "Connect to GitHub" to the chat UI) ... */}
       <main className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 mt-8">
        <div className="p-6 h-[75vh] flex flex-col justify-between">
          <div className="overflow-y-auto flex-grow mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && <Bot className="w-6 h-6 flex-shrink-0 text-cyan-400" />}
                <div className={`p-4 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700'}`}>
                  <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-900">
                    <ReactMarkdown components={renderers}>{msg.parts[0]}</ReactMarkdown>
                  </div>
                </div>
                {msg.role === 'user' && <User className="w-6 h-6 flex-shrink-0 text-indigo-400" />}
              </div>
            ))}
          </div>
          {/* ... (Chat input section) ... */}
        </div>
      </main>
    </>
  );
}

// NOTE: You'll need to copy and paste the full JSX for the GitHubMode component from the previous step,
// and make two main changes:
// 1. Add the <CodeViewer /> modal at the top.
// 2. Add the `components={renderers}` prop to the <ReactMarkdown> component inside the messages map.