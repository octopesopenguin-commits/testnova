import React, { useState } from 'react';
import { Diagnostic } from './components/Diagnostic';
import { Assistant } from './components/Assistant';
import { ResultCategory } from './types';

export default function App() {
  const [assistantVisible, setAssistantVisible] = useState(false);
  const [currentResult, setCurrentResult] = useState<ResultCategory | null>(null);

  const handleShowAssistant = (result: ResultCategory) => {
    setCurrentResult(result);
    setAssistantVisible(true);
  };

  const handleCloseAssistant = () => {
    setAssistantVisible(false);
  };

  return (
    <div className="min-h-screen bg-nova-900 text-nova-light flex flex-col font-sans selection:bg-nova-accent selection:text-nova-900">
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-nova-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-nova-accent to-yellow-700 rounded-sm shadow-md"></div>
          <span className="font-serif text-xl tracking-wide font-bold text-white">NovaMentors</span>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col justify-center py-12 px-6">
        <Diagnostic onShowAssistant={handleShowAssistant} />
      </main>

      <footer className="relative z-10 py-8 text-center text-nova-600 text-sm">
        <p>&copy; {new Date().getFullYear()} NovaMentors. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-60">Results are for informational purposes only. No professional advice guaranteed.</p>
      </footer>

      {assistantVisible && currentResult && (
        <Assistant result={currentResult} onClose={handleCloseAssistant} />
      )}
    </div>
  );
}
