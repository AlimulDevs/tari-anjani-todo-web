import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hai bestie! 💕 Aku di sini untuk bantuin kamu dengan apapun yang kamu butuhkan! Tanya aja ya~ ✨',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputText('');

      // Simulate AI response (placeholder)
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Maaf ya bestie, aku masih dalam tahap development! 🚧 Tapi aku udah excited banget buat ngobrol sama kamu nanti! 💖',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200/30 h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Assistant</h2>
              <p className="text-pink-100">Your digital bestie! 💕</p>
            </div>
            <Sparkles className="w-6 h-6 ml-auto animate-pulse" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 animate-fadeInUp ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white' 
                  : 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white'
              }`}>
                {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block p-4 rounded-2xl shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-br-md'
                    : 'bg-white border-2 border-pink-200 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-pink-200/30">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan kamu di sini..."
              className="flex-1 p-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors bg-white/50"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-3 rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all transform hover:scale-105 shadow-lg"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};