import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-okaidia.css';
import ReactMarkdown from 'react-markdown';
import { Bot, Code, LoaderCircle, Wand2, Languages, CornerDownLeft, User } from 'lucide-react';

const translationLanguages = [
  { value: '', label: 'Translate To...' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
];

export function SnippetMode() {
  const [code, setCode] = useState(`function findMax(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) {\n      max = arr[i];\n    }\n  }\n  return max;\n}`);
  const [output, setOutput] = useState('');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState('review'); // review, refactor, translate
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReview = async (messageContent) => {
    if (isLoading) return;
    setActiveFeature('review');
    setOutput('');

    if (!messageContent && messages.length === 0) messageContent = "Please review this code.";
    if (!messageContent) return;

    const newUserMessage = { role: 'user', parts: [messageContent] };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      // CORRECTED SYNTAX: Use backticks for template literals
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/snippet_chat`, { code, history: newMessages });
      const aiReply = { role: 'model', parts: [response.data.reply] };
      setMessages([...newMessages, aiReply]);
    } catch (error) {
      console.error("Error communicating with the AI:", error);
      const errorMessage = { role: 'model', parts: ["Sorry, an error occurred."] };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaticAction = async (endpoint, payload, feature) => {
    setIsLoading(true);
    setActiveFeature(feature);
    setOutput('');
    setMessages([]);
    try {
      // CORRECTED SYNTAX: Use backticks for template literals
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/${endpoint}`, payload);
      const data = response.data;
      if (data.refactored_code) setOutput(data.refactored_code);
      if (data.translated_code) setOutput(data.translated_code);
    } catch (error) {
      console.error(`Error during ${feature}:`, error);
      setOutput(`Sorry, the ${feature} operation failed.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = () => {
    if (!selectedLanguage) {
      alert('Please select a language to translate to.');
      return;
    }
    handleStaticAction('snippet_translate', { code, language: selectedLanguage }, 'translate');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleReview(userInput);
    }
  };

  const isChatStarted = messages.length > 0;

  const renderOutput = () => {
    if (isLoading && !isChatStarted && activeFeature !== 'review') return <div className="flex justify-center items-center h-full"><LoaderCircle className="w-8 h-8 animate-spin text-indigo-400" /></div>;
    
    if (activeFeature === 'review') {
      return (
        <div className="p-6 overflow-y-auto flex-grow">
            {!isChatStarted && <div className="flex h-full items-center justify-center text-slate-500">Click "Review" to begin the conversation.</div>}
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && <Bot className="w-6 h-6 flex-shrink-0 text-cyan-400" />}
                <div className={`p-4 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700'}`}>
                  <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-900"><ReactMarkdown>{msg.parts[0]}</ReactMarkdown></div>
                </div>
                {msg.role === 'user' && <User className="w-6 h-6 flex-shrink-0 text-indigo-400" />}
              </div>
            ))}
            {isLoading && isChatStarted && <div className="flex items-start gap-3 my-4"><Bot className="w-6 h-6 flex-shrink-0 text-cyan-400" /><div className="p-4 rounded-lg bg-slate-700 flex items-center"><LoaderCircle className="w-5 h-5 animate-spin" /></div></div>}
            <div ref={chatEndRef} />
        </div>
      );
    }

    if (!output) return <div className="flex justify-center items-center h-full text-slate-500">The output will appear here.</div>;
    const languageClass = activeFeature === 'translate' ? `language-${selectedLanguage}` : 'language-js';
    return <div className="p-6"><pre><code className={languageClass}>{output}</code></pre></div>;
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div className="flex flex-col">
        <label className="flex items-center gap-2 mb-3 text-xl font-semibold text-slate-300">
          <Code className="w-6 h-6 text-indigo-400" />
          Code Snippet
        </label>
        <div className="bg-slate-800 rounded-lg shadow-2xl h-96 lg:h-[32rem] flex-grow font-mono text-sm border border-slate-700">
          <Editor
            value={code}
            onValueChange={newCode => setCode(newCode)}
            highlight={code => highlight(code, languages.js, 'js')}
            padding={16}
            className="h-full"
            style={{ minHeight: '100%', outline: 'none' }}
            disabled={isChatStarted && activeFeature === 'review'}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => handleReview()}
            disabled={isLoading || !code}
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            <Bot className="w-5 h-5" /> Review
          </button>
          <button
            onClick={() => handleStaticAction('snippet_refactor', { code }, 'refactor')}
            disabled={isLoading || !code}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            <Wand2 className="w-5 h-5" /> Refactor
          </button>
          <div className="col-span-2 flex items-center gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 py-3 px-4 rounded-lg focus:outline-none focus:border-indigo-500"
              disabled={isLoading}
            >
              {translationLanguages.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <button
              onClick={handleTranslate}
              disabled={isLoading || !code || !selectedLanguage}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
              <Languages className="w-5 h-5" /> Translate
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <label className="flex items-center gap-2 mb-3 text-xl font-semibold text-slate-300">
          <Wand2 className="w-6 h-6 text-cyan-400" />
          AI Output
        </label>
        <div className="bg-slate-800 rounded-lg shadow-2xl h-full border border-slate-700 flex flex-col justify-between">
          {renderOutput()}
          {activeFeature === 'review' && isChatStarted && (
            <div className="p-4 border-t border-slate-700">
              <div className="relative">
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask a follow-up question..." className="w-full bg-slate-700 text-slate-200 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading} />
                <button onClick={() => handleReview(userInput)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:bg-slate-600" disabled={isLoading || !userInput}><CornerDownLeft className="w-5 h-5"/></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
