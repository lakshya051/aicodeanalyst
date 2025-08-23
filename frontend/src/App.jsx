// import React, { useState } from 'react';
// import axios from 'axios';
// import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism-okaidia.css'; // A great dark theme for code
// import ReactMarkdown from 'react-markdown';
// import { Bot, Code, LoaderCircle, Sparkles } from 'lucide-react';

// function App() {
//   const [code, setCode] = useState(`function greet(name) {\n  console.log("Hello, " + name);\n}`);
//   const [review, setReview] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleReview = async () => {
//     setIsLoading(true);
//     setReview('');
//     try {
//       const response = await axios.post('http://localhost:5000/review', { code });
//       setReview(response.data.review);
//     } catch (error) {
//       console.error("Error fetching review:", error);
//       setReview("Sorry, something went wrong. Please check the console for details.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <header className="text-center mb-12">
//           <div className="flex justify-center items-center gap-3">
//             <Sparkles className="w-10 h-10 text-purple-400" />
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
//               AI Code Reviewer
//             </h1>
//           </div>
//           <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
//             Paste your code snippet below, and let our AI assistant provide a detailed review and suggest improvements.
//           </p>
//         </header>

//         {/* Main Content Grid */}
//         <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* Code Editor Section */}
//           <div className="flex flex-col">
//             <label className="flex items-center gap-2 mb-3 text-xl font-semibold text-slate-300">
//               <Code className="w-6 h-6 text-purple-400" />
//               Your Code
//             </label>
//             <div className="bg-slate-800 rounded-lg shadow-2xl h-96 lg:h-[32rem] flex-grow font-mono text-sm border border-slate-700">
//               <Editor
//                 value={code}
//                 onValueChange={newCode => setCode(newCode)}
//                 highlight={code => highlight(code, languages.js, 'js')}
//                 padding={16}
//                 className="h-full"
//                 style={{
//                   minHeight: '100%',
//                   outline: 'none',
//                 }}
//               />
//             </div>
//             <button
//               onClick={handleReview}
//               disabled={isLoading || !code}
//               className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 flex items-center justify-center gap-2 text-white shadow-lg"
//             >
//               {isLoading ? (
//                 <>
//                   <LoaderCircle className="animate-spin w-5 h-5" />
//                   Analyzing...
//                 </>
//               ) : (
//                 'Review My Code'
//               )}
//             </button>
//           </div>

//           {/* AI Feedback Section */}
//           <div className="flex flex-col">
//             <label className="flex items-center gap-2 mb-3 text-xl font-semibold text-slate-300">
//               <Bot className="w-6 h-6 text-pink-500" />
//               AI Feedback
//             </label>
//             <div className="bg-slate-800 rounded-lg p-6 h-96 lg:h-[32rem] shadow-2xl overflow-y-auto border border-slate-700 prose prose-invert prose-sm max-w-none prose-pre:bg-slate-900 prose-headings:text-slate-200">
//               {isLoading && (
//                 <div className="flex justify-center items-center h-full">
//                   <div className="flex flex-col items-center gap-2 text-slate-400">
//                     <LoaderCircle className="w-8 h-8 animate-spin text-purple-400" />
//                     <span>Analyzing your code...</span>
//                   </div>
//                 </div>
//               )}
//               {!isLoading && !review && (
//                 <div className="flex justify-center items-center h-full text-slate-500">
//                   <span>Your code review will appear here.</span>
//                 </div>
//               )}
//               {review && <ReactMarkdown>{review}</ReactMarkdown>}
//             </div>
//           </div>
//         </main>
        
//         {/* Footer */}
//         <footer className="text-center mt-12 text-slate-500 text-sm">
//           <p>Powered by Google Gemini & React. Styled with Tailwind CSS.</p>
//         </footer>

//       </div>
//     </div>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import axios from 'axios';
// import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism-okaidia.css';
// import ReactMarkdown from 'react-markdown';
// import { Bot, Code, LoaderCircle, Wand2, Languages } from 'lucide-react';

// const translationLanguages = [
//   { value: '', label: 'Translate To...' },
//   { value: 'python', label: 'Python' },
//   { value: 'javascript', label: 'JavaScript' },
//   { value: 'java', label: 'Java' },
//   { value: 'go', label: 'Go' },
//   { value: 'csharp', label: 'C#' },
//   { value: 'cpp', label: 'C++' },
//   { value: 'rust', label: 'Rust' },
// ];

// function App() {
//   const [code, setCode] = useState(`// Paste your code here\nfunction factorial(n) {\n  if (n === 0) {\n    return 1;\n  }\n  return n * factorial(n - 1);\n}`);
//   const [output, setOutput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeFeature, setActiveFeature] = useState(''); // 'review', 'refactor', 'translate'
//   const [selectedLanguage, setSelectedLanguage] = useState('');

//   const handleApiCall = async (endpoint, payload, feature) => {
//     setIsLoading(true);
//     setActiveFeature(feature);
//     setOutput('');
//     try {
//       const response = await axios.post(`http://localhost:5000/${endpoint}`, payload);
//       const data = response.data;
      
//       console.log("Response from backend:", data);

//       if (data.review) setOutput(data.review);
//       if (data.refactored_code) setOutput(data.refactored_code);
//       if (data.translated_code) setOutput(data.translated_code);
//     } catch (error) {
//       console.error(`Error during ${feature}:`, error);
//       setOutput(`Sorry, the ${feature} operation failed. Please check the console.`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTranslate = () => {
//     if (!selectedLanguage) {
//       alert('Please select a language to translate to.');
//       return;
//     }
//     handleApiCall('translate', { code, language: selectedLanguage }, 'translate');
//   };

//   const renderOutput = () => {
//     if (isLoading) {
//       return (
//         <div className="flex justify-center items-center h-full">
//           <div className="flex flex-col items-center gap-2 text-slate-400">
//             <LoaderCircle className="w-8 h-8 animate-spin text-indigo-400" />
//             <span>Processing your request...</span>
//           </div>
//         </div>
//       );
//     }

//     if (!output) {
//       return <div className="flex justify-center items-center h-full text-slate-500"><span>The output will appear here.</span></div>;
//     }

//     if (activeFeature === 'review') {
//       return (
//         <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-900 prose-headings:text-slate-200">
//           <ReactMarkdown>{output}</ReactMarkdown>
//         </div>
//       );
//     }
    
//     const languageClass = activeFeature === 'translate' ? `language-${selectedLanguage}` : 'language-js';
//     return <pre><code className={languageClass}>{output}</code></pre>;
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <header className="text-center mb-12">
//           <div className="flex justify-center items-center gap-3">
//             <Wand2 className="w-10 h-10 text-indigo-400" />
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-500">
//               AI Code Transformer
//             </h1>
//           </div>
//           <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
//             Review, refactor, and translate your code with the power of AI.
//           </p>
//         </header>

//         <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           <div className="flex flex-col">
//             <label className="flex items-center gap-2 mb-3 text-xl font-semibold text-slate-300">
//               <Code className="w-6 h-6 text-indigo-400" />
//               Your Code
//             </label>
//             <div className="bg-slate-800 rounded-lg shadow-2xl h-96 lg:h-[32rem] flex-grow font-mono text-sm border border-slate-700">
//               <Editor
//                 value={code}
//                 onValueChange={newCode => setCode(newCode)} // <-- Corrected prop name
//                 highlight={code => highlight(code, languages.js, 'js')}
//                 padding={16}
//                 className="h-full"
//                 style={{ minHeight: '100%', outline: 'none' }}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <button
//                 onClick={() => handleApiCall('review', { code }, 'review')}
//                 disabled={isLoading || !code}
//                 className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 text-white shadow-lg"
//               >
//                 <Bot className="w-5 h-5" /> Review
//               </button>
//               <button
//                 onClick={() => handleApiCall('refactor', { code }, 'refactor')}
//                 disabled={isLoading || !code}
//                 className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 text-white shadow-lg"
//               >
//                 <Wand2 className="w-5 h-5" /> Refactor
//               </button>
//               <div className="col-span-2 flex items-center gap-4">
//                 <select
//                   value={selectedLanguage}
//                   onChange={(e) => setSelectedLanguage(e.target.value)}
//                   className="w-full bg-slate-800 border border-slate-700 text-slate-300 py-3 px-4 rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm"
//                   disabled={isLoading}
//                 >
//                   {translationLanguages.map((lang) => (
//                     <option key={lang.value} value={lang.value}>{lang.label}</option>
//                   ))}
//                 </select>
//                 <button
//                   onClick={handleTranslate}
//                   disabled={isLoading || !code || !selectedLanguage}
//                   className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 text-white shadow-lg"
//                 >
//                   <Languages className="w-5 h-5" /> Translate
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col">
//             <label className="flex items-center gap-2 mb-3 text-xl font-semibold text-slate-300">
//               <Wand2 className="w-6 h-6 text-cyan-400" />
//               AI Output
//             </label>
//             <div className="bg-slate-800 rounded-lg p-6 h-96 lg:h-[32rem] shadow-2xl overflow-y-auto border border-slate-700">
//               {renderOutput()}
//             </div>
//           </div>
//         </main>

//         <footer className="text-center mt-12 text-slate-500 text-sm">
//           <p>Powered by Google Gemini & React. Styled with Tailwind CSS.</p>
//         </footer>
//       </div>
//     </div>
//   );
// }

// export default App;



// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism-okaidia.css';
// import ReactMarkdown from 'react-markdown';
// import { Bot, Code, LoaderCircle, CornerDownLeft, User } from 'lucide-react';

// function App() {
//   const [code, setCode] = useState(`// Paste your code here and start the conversation!\nfunction findMax(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) {\n      max = arr[i];\n    }\n  }\n  return max;\n}`);
//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = async (messageContent) => {
//     if (isLoading) return; // Prevent multiple submissions

//     if (!messageContent && messages.length === 0) {
//       // On first message, use a default prompt
//       messageContent = "Please review this code.";
//     }

//     if (!messageContent) return;

//     const newUserMessage = { role: 'user', parts: [messageContent] };
//     const newMessages = [...messages, newUserMessage];
//     setMessages(newMessages);
//     setUserInput('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/chat', {
//         code,
//         history: newMessages,
//       });
//       const aiReply = { role: 'model', parts: [response.data.reply] };
//       setMessages([...newMessages, aiReply]);
//     } catch (error) {
//       console.error("Error communicating with the AI:", error);
//       const errorMessage = { role: 'model', parts: ["Sorry, I encountered an error. Please try again."] };
//       setMessages([...newMessages, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter' && !event.shiftKey) {
//       event.preventDefault();
//       handleSendMessage(userInput);
//     }
//   };

//   const isChatStarted = messages.length > 0;

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <header className="text-center mb-12">
//           <div className="flex justify-center items-center gap-3">
//             <Bot className="w-10 h-10 text-cyan-400" />
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
//               Conversational Code Sandbox
//             </h1>
//           </div>
//           <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
//             Get an AI code review, then ask follow-up questions to understand and improve your code.
//           </p>
//         </header>

//         <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           <div className="flex flex-col">
//             <label className="flex items-center gap-2 mb-3 text-xl font-semibold text-slate-300">
//               <Code className="w-6 h-6 text-indigo-400" />
//               Your Code
//             </label>
//             <div className={`bg-slate-800 rounded-lg shadow-2xl h-96 lg:h-[32rem] flex-grow font-mono text-sm border border-slate-700 transition-opacity duration-500 ${isChatStarted ? 'opacity-60' : 'opacity-100'}`}>
//               <Editor
//                 value={code}
//                 onValueChange={newCode => setCode(newCode)}
//                 highlight={code => highlight(code, languages.js, 'js')}
//                 padding={16}
//                 className="h-full"
//                 style={{ minHeight: '100%', outline: 'none' }}
//                 disabled={isChatStarted}
//               />
//             </div>
//           </div>

//           <div className="flex flex-col">
//             <label className="flex items-center gap-2 mb-3 text-xl font-semibold text-slate-300">
//               <Bot className="w-6 h-6 text-cyan-400" />
//               AI Mentor Chat
//             </label>
//             <div className="bg-slate-800 rounded-lg shadow-2xl h-96 lg:h-[32rem] border border-slate-700 flex flex-col justify-between">
//               <div className="p-6 overflow-y-auto flex-grow">
//                 {!isChatStarted && <div className="flex h-full items-center justify-center text-slate-500">Click "Start Review" to begin the conversation.</div>}
//                 {messages.map((msg, index) => (
//                   <div key={index} className={`flex items-start gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
//                     {msg.role === 'model' && <Bot className="w-6 h-6 flex-shrink-0 text-cyan-400" />}
//                     <div className={`p-4 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700'}`}>
//                       <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-900 prose-headings:text-slate-200">
//                         <ReactMarkdown>{msg.parts[0]}</ReactMarkdown>
//                       </div>
//                     </div>
//                     {msg.role === 'user' && <User className="w-6 h-6 flex-shrink-0 text-indigo-400" />}
//                   </div>
//                 ))}
//                 {isLoading && (
//                   <div className="flex items-start gap-3 my-4">
//                     <Bot className="w-6 h-6 flex-shrink-0 text-cyan-400" />
//                     <div className="p-4 rounded-lg bg-slate-700 flex items-center">
//                       <LoaderCircle className="w-5 h-5 animate-spin" />
//                     </div>
//                   </div>
//                 )}
//                 <div ref={chatEndRef} />
//               </div>
//               <div className="p-4 border-t border-slate-700">
//                 {isChatStarted ? (
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={userInput}
//                       onChange={(e) => setUserInput(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Ask a follow-up question..."
//                       className="w-full bg-slate-700 text-slate-200 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       disabled={isLoading}
//                     />
//                     <button onClick={() => handleSendMessage(userInput)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:bg-slate-600" disabled={isLoading || !userInput}>
//                       <CornerDownLeft className="w-5 h-5"/>
//                     </button>
//                   </div>
//                 ) : (
//                   <button onClick={() => handleSendMessage()} className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-3 px-4 rounded-lg transition-all duration-300 text-white shadow-lg" disabled={isLoading || !code}>
//                     Start Review
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;
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