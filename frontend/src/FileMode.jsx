import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Bot, LoaderCircle, CornerDownLeft, User, UploadCloud } from 'lucide-react';
import StatsDashboard from './StatsDashboard';
import VisualizationDashboard from './VisualizationDashboard';

export function FileMode() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [stats, setStats] = useState(null);
  const [vizData, setVizData] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);
    setFileName(file.name);
    setStats(null);
    setVizData(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setIsFileUploaded(true);
      setMessages([{ role: 'model', parts: [`Successfully indexed '${file.name}'. You can now ask questions.`] }]);
      const fileContent = await file.text();
      const statsResponse = await axios.post('http://localhost:5000/analyze', { code: fileContent });
      setStats(statsResponse.data);
      if (file.name.endsWith('.py')) {
        const vizResponse = await axios.post('http://localhost:5000/visualize', { code: fileContent });
        setVizData(vizResponse.data);
      }
    } catch (error) {
      console.error("Error during file processing:", error);
      setMessages([{ role: 'model', parts: ["Sorry, an error occurred while processing your file."] }]);
    } finally {
      setIsLoading(false);
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
      const response = await axios.post('http://localhost:5000/file_chat', { question: userInput });
      const aiReply = { role: 'model', parts: [response.data.reply] };
      setMessages([...newMessages, aiReply]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...newMessages, { role: 'model', parts: ["Sorry, I couldn't get a response."] }]);
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

  return (
    <main className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 mt-8">
      <div className="p-6 h-[75vh] flex flex-col justify-between">
        <StatsDashboard stats={stats} />
        <VisualizationDashboard vizData={vizData} />
        <div className="overflow-y-auto flex-grow mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <Bot className="w-6 h-6 flex-shrink-0 text-cyan-400" />}
              <div className={`p-4 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700'}`}>
                <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-900"><ReactMarkdown>{msg.parts[0]}</ReactMarkdown></div>
              </div>
              {msg.role === 'user' && <User className="w-6 h-6 flex-shrink-0 text-indigo-400" />}
            </div>
          ))}
          {isLoading && !isFileUploaded && <div className="text-center text-slate-400">Processing '{fileName}'...</div>}
          <div ref={chatEndRef} />
        </div>
        {!isFileUploaded ? (
          <div className="flex items-center justify-center w-full">
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-4 text-slate-400" />
                <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload a file</span></p>
                <p className="text-xs text-slate-500">(.py, .js, .txt, .pdf, etc.)</p>
              </div>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <div className="relative border-t border-slate-700 pt-4">
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={handleKeyPress} placeholder={`Ask a question about ${fileName}...`} className="w-full bg-slate-700 text-slate-200 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading} />
            <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 p-2 rounded-lg text-slate-400 hover:bg-slate-600" disabled={isLoading || !userInput}><CornerDownLeft className="w-5 h-5"/></button>
          </div>
        )}
      </div>
    </main>
  );
}