import React, { useState, useEffect } from 'react';
import { QUESTIONS, calculateResult, getResultDescription } from '../utils/scoring';
import { DiagnosticState, ResultCategory, LEAD_MAGNET_TITLE } from '../types';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';

interface DiagnosticProps {
  onShowAssistant: (result: ResultCategory) => void;
}

export const Diagnostic: React.FC<DiagnosticProps> = ({ onShowAssistant }) => {
  const [state, setState] = useState<DiagnosticState>({
    isStarted: false,
    isCompleted: false,
    currentQuestionIndex: 0,
    answers: {},
    result: null,
  });

  // Check storage on mount
  useEffect(() => {
    const storedCompleted = sessionStorage.getItem('leadMagnetCompleted');
    const storedResult = sessionStorage.getItem('leadMagnetResult');
    
    if (storedCompleted === 'true' && storedResult) {
      setState(prev => ({
        ...prev,
        isStarted: true,
        isCompleted: true,
        result: storedResult as ResultCategory
      }));
    }
  }, []);

  const handleStart = () => {
    setState(prev => ({ ...prev, isStarted: true }));
  };

  const handleAnswer = (category: ResultCategory) => {
    const nextAnswers = {
      ...state.answers,
      [QUESTIONS[state.currentQuestionIndex].id]: category
    };

    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
      setState(prev => ({
        ...prev,
        answers: nextAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Finished
      const result = calculateResult(nextAnswers);
      
      // Store in session
      sessionStorage.setItem('leadMagnetCompleted', 'true');
      sessionStorage.setItem('leadMagnetTitle', LEAD_MAGNET_TITLE);
      sessionStorage.setItem('leadMagnetResult', result);

      setState(prev => ({
        ...prev,
        answers: nextAnswers,
        isCompleted: true,
        result: result
      }));
    }
  };

  const handleBookCall = () => {
    window.open('https://calendar.app.google/xiA5mmnkpeKbmcAP9', '_blank');
  };

  if (!state.isStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in px-4">
        <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight">
          Is Your Department Performance <span className="text-nova-accent">Bottlenecked?</span>
        </h1>
        <p className="text-lg text-nova-300 leading-relaxed max-w-xl mx-auto">
          As a manager, it’s difficult to scale efficiency when you can't pinpoint the friction. 
          Take this 1-minute category diagnostic to uncover your primary operational bottleneck.
        </p>
        <div className="pt-4">
          <Button onClick={handleStart} className="text-lg px-8 py-4">
            Identify My Bottleneck
          </Button>
        </div>
        <p className="text-xs text-nova-500 uppercase tracking-widest pt-12">
          NovaMentors • Exclusive Diagnostic Tool
        </p>
      </div>
    );
  }

  if (state.isCompleted && state.result) {
    return (
      <div className="max-w-2xl mx-auto bg-nova-800/50 border border-nova-700 rounded-xl p-8 md:p-12 animate-fade-in shadow-2xl">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-nova-accent/10 border border-nova-accent/30 text-nova-accent text-sm font-semibold tracking-wide uppercase mb-4">
            Diagnostic Complete
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl text-white">
            {state.result}
          </h2>
          
          <div className="h-px w-24 bg-nova-700 mx-auto my-6"></div>

          <p className="text-nova-200 text-lg leading-relaxed">
            {getResultDescription(state.result)}
          </p>

          <div className="pt-10 space-y-4 max-w-sm mx-auto">
            {/* Primary CTA */}
            <Button 
              onClick={handleBookCall} 
              fullWidth 
              className="text-lg font-semibold"
            >
              Book a Strategy Call
            </Button>
            
            <p className="text-sm text-nova-400 pt-2 pb-1">Or, for immediate insight:</p>

            {/* Secondary CTA */}
            <Button 
              onClick={() => onShowAssistant(state.result!)} 
              variant="secondary" 
              fullWidth
            >
              Explain my result with AI Assistant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[state.currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto w-full px-4 animate-fade-in">
      <div className="mb-6 flex justify-between items-end text-sm text-nova-400">
        <span>Question {state.currentQuestionIndex + 1} of {QUESTIONS.length}</span>
        <span>{Math.round(((state.currentQuestionIndex) / QUESTIONS.length) * 100)}%</span>
      </div>
      
      <ProgressBar current={state.currentQuestionIndex} total={QUESTIONS.length} />

      <h2 className="font-serif text-2xl md:text-3xl text-white mb-10 leading-snug">
        {currentQuestion.text}
      </h2>

      <div className="space-y-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option.category)}
            className="w-full text-left p-6 rounded-lg bg-nova-800 border border-nova-700 hover:border-nova-accent hover:bg-nova-700/80 transition-all duration-200 group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full border border-nova-500 group-hover:border-nova-accent mr-4 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-nova-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-lg text-nova-200 group-hover:text-white transition-colors">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
