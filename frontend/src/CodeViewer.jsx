import React, { useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';

function CodeViewer({ fileContent, language, highlightedLine, onClose }) {
  useEffect(() => {
    setTimeout(() => {
      const lineEl = document.querySelector(`.line-${highlightedLine}`);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, [highlightedLine]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-800 w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl border border-slate-700 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="font-semibold text-white">Code Viewer</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="flex-grow overflow-auto font-mono text-sm">
          <Editor
            value={fileContent}
            onValueChange={() => {}} // Read-only
            highlight={(code) =>
              highlight(code, languages[language] || languages.js, language)
                .split('\n')
                .map((line, i) => `<span class='line-wrapper line-${i + 1} ${i + 1 === highlightedLine ? 'bg-indigo-900/50' : ''}'>${line}</span>`)
                .join('\n')
            }
            padding={16}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default CodeViewer;
