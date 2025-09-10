import React, { useState } from 'react';
import { Lock, Heart, Eye, EyeOff } from 'lucide-react';

interface PinInputProps {
  onSuccess: () => void;
}

export const PinInput: React.FC<PinInputProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pin !== '1304') {
      setError('PIN salah, coba lagi bestie ✨');
      triggerShake();
      alert('❌ PIN gagal, coba lagi!');
      return;
    }

    localStorage.setItem('userPin', pin);
    onSuccess();
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const handlePinChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setPin(numericValue);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-rose-200/40 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      <div className="absolute bottom-32 right-10 w-12 h-12 bg-rose-300/30 rounded-full blur-lg animate-pulse delay-700"></div>

      <div className={`bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-pink-200/50 transform transition-all duration-300 ${
        isShaking ? 'animate-shake' : 'hover:scale-105'
      }`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 rounded-full mb-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
            <Heart className="w-12 h-12 text-white animate-pulse" fill="currentColor" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
            Selamat Datang Tari! 💕
          </h1>
          <p className="text-pink-600 text-lg font-medium">
            Masukkan PIN kamu untuk melanjutkan
          </p>
          <p className="text-pink-500 text-sm mt-2">
            Bestie, jangan lupa PIN-nya ya! ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-pink-700 text-sm font-semibold mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              PIN Kamu
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5 z-10" />
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-14 pr-14 py-4 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium text-center tracking-widest placeholder-pink-300"
                  placeholder="••••"
                  maxLength={10}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors z-10"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-2xl blur opacity-50"></div>
              <div className="relative text-red-600 text-sm text-center bg-red-50/80 backdrop-blur-sm py-3 px-4 rounded-2xl border border-red-200 flex items-center justify-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all transform relative overflow-hidden bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 hover:scale-105 hover:shadow-xl shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center justify-center gap-3">
              <Heart className="w-5 h-5" fill="currentColor" />
              Masuk ke Aplikasi
              <span className="text-xl">✨</span>
            </span>
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};
