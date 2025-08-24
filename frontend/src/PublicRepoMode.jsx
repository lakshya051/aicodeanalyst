import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Bot, LoaderCircle, CornerDownLeft, User, Link } from 'lucide-react';
import CodeViewer from './CodeViewer';

export function PublicRepoMode() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [viewerState, setViewerState] = useState({
    isOpen: false,
    fileContent: '',
    language: 'js',
    line: null,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAnalyzeRepo = async () => {
    if (!repoUrl) return;
    setIsAnalyzing(true);
    setIsAnalyzed(false);
    setMessages([]);
    try {
      // CORRECTED SYNTAX: Use backticks for template literals
      await axios.post(`${import.meta.env.VITE_API_URL}/analyze-url`, { repo_url: repoUrl });
      setIsAnalyzed(true);
      setMessages([{ role: 'model', parts: [`Successfully analyzed repository. You can now ask questions.`] }]);
    } catch (error) {
      console.error("Error analyzing repo:", error);
      setMessages([{ role: 'model', parts: [error.response?.data?.error || "Failed to analyze repository."] }]);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput || isLoading) return;
    const newUserMessage = { role: 'user', parts: [userInput] };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);
    try {
      // CORRECTED SYNTAX: Use backticks for template literals
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/url_chat`, { question: userInput });
      const aiReply = { role: 'model', parts: [response.data.reply] };
      setMessages([...newMessages, aiReply]);
    } catch (error)
      console.error("Error in repo chat:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleCitationClick = async (filePath, lineNumber) => {
    try {
      const cleanFilePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      const rawUrl = repoUrl.replace('github.com', 'raw.githubusercontent.com') + `/main/${cleanFilePath}`;
      const response = await axios.get(rawUrl);
      const fileContent = response.data;
      const language = filePath.split('.').pop();
      
      setViewerState({
        isOpen: true,
        fileContent,
        language,
        line: lineNumber,
      });
    } catch (error) {
      console.error("Failed to fetch file content:", error);
      alert(`Could not load file: ${filePath}. It may be in a different branch than 'main'.`);
    }
  };

  const renderers = {
    a: ({ href, children }) => {
      const citationText = Array.isArray(children) ? children[0] : children;
      const match = typeof citationText === 'string' ? /\[(.*?)(?::(\d+))?\]/.exec(citationText) : null;
      
      if (match) {
        const [_, filePath, lineNumber] = match;
        return (
          <button
            onClick={() => handleCitationClick(filePath, lineNumber ? parseInt(lineNumber) : null)}
            className="bg-indigo-600/50 text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/50 transition-colors text-sm font-mono"
          >
            {citationText}
          </button>
        );
      }
      return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
  };

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
      <main className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 mt-8">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Paste a public GitHub repository URL..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
              disabled={isAnalyzing}
            />
            <button 
                onClick={handleAnalyzeRepo} 
                disabled={!repoUrl || isAnalyzing} // CORRECTED BUTTON LOGIC
                className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed flex-shrink-0"
            >
                {isAnalyzing ? "Analyzing..." : "Analyze Repository"}
            </button>
          </div>
        </div>

        <div className="p-6 h-[60vh] flex flex-col justify-between border-t border-slate-700">
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
            {isLoading && <div className="flex items-start gap-3 my-4"><Bot className="w-6 h-6 flex-shrink-0 text-cyan-400" /><div className="p-4 rounded-lg bg-slate-700 flex items-center"><LoaderCircle className="w-5 h-5 animate-spin" /></div></div>}
            <div ref={chatEndRef} />
          </div>

          {isAnalyzed && (
            <div className="relative border-t border-slate-700 pt-4">
              <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask about the repository..." className="w-full bg-slate-700 text-slate-200 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading} />
              <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 p-2 rounded-lg text-slate-400 hover:bg-slate-600" disabled={isLoading || !userInput}><CornerDownLeft className="w-5 h-5"/></button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
