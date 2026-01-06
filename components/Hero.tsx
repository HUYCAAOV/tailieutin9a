import React from 'react';
import TiltCard from './TiltCard';
import { ViewState } from '../types';

interface HeroProps {
  setView: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Pulsing Blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] animate-pulse"></div>
        
        {/* Rotating Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dashed border-white/10 rounded-full animate-spin-reverse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full animate-spin-slow opacity-50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <h1 className="text-6xl md:text-8xl font-extrabold leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-2xl">
              Học Tập
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink mt-2 animate-float">
              Đa Chiều
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-light border-l-4 border-neon-blue pl-6 backdrop-blur-sm bg-black/10 py-2 rounded-r-xl">
            Khám phá, chia sẻ và kiếm tiền từ tri thức của bạn trong một không gian 3D sống động.
            Nền tảng tài liệu học tập thế hệ mới.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => setView('MARKET')}
              className="px-8 py-4 bg-white text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(188,19,254,0.5)] transition-all duration-300 flex items-center gap-2 group"
            >
              Khám Phá Ngay <span className="group-hover:translate-x-1 transition-transform">🚀</span>
            </button>
            <button 
              onClick={() => setView('UPLOAD')}
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-neon-purple hover:text-neon-purple transition-all duration-300"
            >
              Bán Tài Liệu 💵
            </button>
          </div>
        </div>

        {/* 3D Visual */}
        <div className="relative h-[500px] w-full flex items-center justify-center perspective-1000">
           {/* Decorative floating elements */}
           <div className="absolute top-0 right-10 w-24 h-24 bg-gradient-to-br from-neon-blue/30 to-transparent rounded-xl border border-white/20 animate-float opacity-80 backdrop-blur-md rotate-12 z-0 shadow-[0_0_20px_rgba(0,243,255,0.3)]"></div>
           <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-tr from-neon-pink/30 to-transparent rounded-full border border-white/20 animate-float-delayed opacity-60 backdrop-blur-md -rotate-6 z-0 shadow-[0_0_20px_rgba(255,0,153,0.3)]"></div>
           
           {/* 3D Cube-like accents */}
           <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full animate-ping opacity-75"></div>

           <TiltCard className="w-80 md:w-96 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl z-10">
              <div className="h-48 w-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-inner flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Toán Cao Cấp A1</h3>
              <p className="text-gray-400 text-sm mb-4">Tóm tắt công thức, bài tập mẫu và đề thi các năm.</p>
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-bold border border-neon-purple/20">#DaiHoc</span>
                <span className="text-xl font-bold text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">120 Credits</span>
              </div>
           </TiltCard>
        </div>
      </div>
    </div>
  );
};

export default Hero;