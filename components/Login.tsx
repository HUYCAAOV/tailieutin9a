import React, { useState, useEffect } from 'react';
import TiltCard from './TiltCard';
import { getDeviceId } from '../utils/security';

interface LoginProps {
  onLogin: (key: string, deviceId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'LOCKED' | 'SUCCESS'>('IDLE');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === 'LOCKED') return;

    // Simulate scanning
    setStatus('SCANNING');
    setError('');

    // Artificial delay for "security scan"
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (inputKey === 'test123@' || inputKey === 'vip123@') {
      setStatus('SUCCESS');
      setTimeout(() => {
        onLogin(inputKey, deviceId);
      }, 800);
    } else {
      setStatus('IDLE');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setStatus('LOCKED');
        setError('⚠️ PHÁT HIỆN XÂM NHẬP: Hệ thống đã bị khóa tạm thời.');
        setTimeout(() => {
            setAttempts(0);
            setStatus('IDLE');
            setError('');
        }, 10000); // Lock for 10 seconds
      } else {
        setError(`Mã truy cập không hợp lệ. Còn lại ${3 - newAttempts} lần thử.`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] overflow-hidden relative font-mono">
      {/* Matrix-like Background */}
      <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-5 pointer-events-none bg-cover"></div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/10 rounded-full blur-[120px]"></div>
      </div>

      <TiltCard className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-neon-blue/30 rounded-xl p-8 shadow-[0_0_50px_rgba(0,243,255,0.1)] relative z-10">
        
        {/* Decorative Tech Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent animate-pulse"></div>

        <div className="text-center mb-8 relative">
          <div className={`w-20 h-20 mx-auto rounded-full border-2 flex items-center justify-center text-3xl mb-4 transition-all duration-500 relative
            ${status === 'SCANNING' ? 'border-neon-blue animate-spin' : 
              status === 'LOCKED' ? 'border-red-500 bg-red-500/20' : 
              status === 'SUCCESS' ? 'border-green-500 bg-green-500/20' : 'border-gray-600 bg-gray-800'}
          `}>
             {status === 'SCANNING' && <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin"></div>}
             {status === 'LOCKED' ? '⛔' : status === 'SUCCESS' ? '🔓' : '🛡️'}
          </div>
          
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Secure Gate</h1>
          <p className="text-neon-blue text-xs mt-1">DEVICE ID: {deviceId}</p>
        </div>

        {status === 'LOCKED' ? (
           <div className="text-center p-4 bg-red-900/30 border border-red-500/50 rounded-lg animate-pulse">
              <h3 className="text-red-500 font-bold text-xl mb-2">SYSTEM LOCKED</h3>
              <p className="text-gray-300 text-sm">Vui lòng đợi 10 giây...</p>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Pass Key Authentication</label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setError('');
                }}
                disabled={status === 'SCANNING' || status === 'SUCCESS'}
                placeholder="ACCESS CODE"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all placeholder-gray-700 text-center text-xl tracking-[0.5em] font-bold"
                autoFocus
              />
              {status === 'SCANNING' && (
                <div className="absolute top-9 left-2 right-2 h-[2px] bg-neon-blue shadow-[0_0_10px_#00f3ff] animate-float opacity-80 pointer-events-none"></div>
              )}
            </div>
            
            {error && <p className="text-center text-red-400 text-xs font-bold animate-bounce uppercase">{error}</p>}

            <button
              type="submit"
              disabled={status !== 'IDLE'}
              className={`w-full py-4 font-bold rounded-lg shadow-lg transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2
                ${status === 'SUCCESS' 
                  ? 'bg-green-500 text-black scale-105' 
                  : 'bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10 hover:border-neon-blue text-gray-300 hover:text-white hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]'
                }
              `}
            >
              {status === 'SCANNING' ? 'VERIFYING...' : status === 'SUCCESS' ? 'ACCESS GRANTED' : 'INITIATE SESSION'}
            </button>
          </form>
        )}
        
        <div className="mt-8 flex justify-between items-center text-[10px] text-gray-600 uppercase">
          <span>Encrypted: AES-256</span>
          <span>Status: Protected</span>
        </div>
      </TiltCard>
    </div>
  );
};

export default Login;