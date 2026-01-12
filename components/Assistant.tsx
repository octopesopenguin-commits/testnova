
import React, { useState, useEffect, useRef } from 'react';
import { ResultCategory } from '../types';
import { getResultDescription } from '../utils/scoring';
import { Button } from './Button';

interface AssistantProps {
  result: ResultCategory;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const Assistant: React.FC<AssistantProps> = ({ result, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting based on result
    const initialMessage = `I see your result was **${result}**. \n\n${getResultDescription(result)}\n\nWould you like me to explain specifically how this might be manifesting in your daily operations, or discuss potential first steps to address it?`;
    setMessages([{ role: 'model', text: initialMessage }]);
  }, [result]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    const currentHistory = [...messages];
    
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: currentHistory,
          result: result
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      }
    } catch (error: any) {
      console.error("Error communicating with assistant:", error);
      
      let errorMessage = "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again or book a call for a direct conversation.";
      
      // Handle specific error cases forwarded from the backend
      if (error.message && error.message.includes('403')) {
        errorMessage = "Access Denied: The server's API key is restricted or invalid. Please ensure the Vercel environment variable 'API_KEY' is set correctly and restricted to the correct domains.";
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nova-900/90 backdrop-blur-sm p-4">
      <div className="bg-nova-800 border border-nova-700 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-nova-700 bg-nova-800 rounded-t-xl">
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
             <h3 className="font-serif text-lg text-white">NovaMentors Assistant</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-nova-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-nova-900/50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-nova-700 text-white rounded-br-none' 
                    : 'bg-nova-accent/10 border border-nova-accent/20 text-nova-light rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-nova-accent/10 border border-nova-accent/20 px-4 py-3 rounded-lg rounded-bl-none flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 bg-nova-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-nova-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-nova-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-nova-800 border-t border-nova-700 rounded-b-xl">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-nova-900 border border-nova-600 rounded-md px-4 py-3 text-white focus:outline-none focus:border-nova-accent placeholder-nova-500"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="px-6"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
