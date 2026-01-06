import React, { useEffect, useState } from 'react';
import { DocumentItem, User } from '../types';
import { getStudyTip } from '../services/geminiService';

interface ReaderProps {
  doc: DocumentItem;
  user: User;
  onClose: () => void;
}

const Reader: React.FC<ReaderProps> = ({ doc, user, onClose }) => {
  const [tip, setTip] = useState<string>('');

  useEffect(() => {
    const fetchTip = async () => {
      const t = await getStudyTip(doc.title);
      setTip(t);
    };
    fetchTip();
  }, [doc]);

  const handleDownload = () => {
    const content = `
[SECURE DOCUMENT - DO NOT DISTRIBUTE]
DEVICE ID BINDING: ${user.deviceId}
USER: ${user.name}
TIMESTAMP: ${new Date().toISOString()}

--- DOCUMENT: ${doc.title.toUpperCase()} ---
AUTHOR: ${doc.author}
TYPE: ${doc.type}

--- DESCRIPTION ---
${doc.description}

--- AI SUMMARY ---
${doc.aiSummary || 'N/A'}

--- CONTENT SIMULATION ---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
(This is a generated file for demonstration purposes in StudyVerse 3D)
    `;
    
    const blob = new Blob([content.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SECURE_${doc.title.replace(/\s+/g, '_')}_${user.deviceId.substr(0,4)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col select-none print:hidden">
       {/* Security Watermark Layer */}
       <div className="absolute inset-0 z-[70] pointer-events-none overflow-hidden opacity-10 flex flex-wrap content-center justify-center gap-24 rotate-[-45deg]">
          {Array.from({ length: 20 }).map((_, i) => (
             <div key={i} className="text-2xl font-bold text-gray-500 whitespace-nowrap">
                {user.deviceId} • DO NOT COPY • {user.name}
             </div>
          ))}
       </div>

       <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-neon-blue/30 shadow-lg z-[80]">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <h2 className="text-xl font-bold text-white max-w-md truncate">{doc.title}</h2>
             <span className="px-2 py-0.5 rounded text-[10px] bg-red-900/50 border border-red-500 text-red-400 font-mono tracking-wider">RESTRICTED: DEVICE LOCKED</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/50 rounded-lg hover:bg-neon-blue hover:text-black transition-all font-bold text-sm"
            >
              <span>⬇️</span> Xuất File Mã Hóa
            </button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-colors text-2xl">
              ✕
            </button>
          </div>
       </div>
       
       <div className="flex-1 flex overflow-hidden z-[60]">
          {/* Main Content Area */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-black flex justify-center custom-scrollbar" onContextMenu={(e) => e.preventDefault()}>
             <div className="w-full max-w-4xl bg-white text-black min-h-screen p-8 md:p-12 shadow-2xl rounded-sm relative">
                
                {/* Paper Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-gray-100 rotate-[-30deg] pointer-events-none select-none">
                    CONFIDENTIAL
                </div>

                <h1 className="text-3xl font-bold mb-4 border-b-2 border-black pb-4 relative z-10">{doc.title}</h1>
                <p className="text-sm text-gray-600 italic mb-8 relative z-10">Tác giả: {doc.author} | {doc.type}</p>
                
                <div className="space-y-4 text-lg leading-relaxed font-serif relative z-10">
                   <p className="bg-red-50 p-4 border-l-4 border-red-500 text-sm font-bold text-red-800 mb-6 uppercase tracking-wide">
                     ⚠️ Cảnh báo: Tài liệu này được gắn mã theo dõi {user.deviceId}. Mọi hành vi sao chép trái phép sẽ bị phát hiện.
                   </p>
                   <p>Đây là nội dung mô phỏng của tài liệu. Trong thực tế, đây sẽ là tệp PDF hoặc nội dung Rich Text.</p>
                   <p className="font-bold">Chương 1: Tổng quan</p>
                   <p>{doc.description}</p>
                   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                   <div className="p-4 bg-gray-100 border-l-4 border-blue-500 my-6">
                      <p className="italic font-bold text-gray-700">Ghi chú quan trọng: Hãy nhớ ôn kỹ phần này cho bài thi sắp tới.</p>
                   </div>
                   <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                   
                   {/* Fake obfuscated text for effect */}
                   <p className="blur-[2px] opacity-50 select-none">Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
             </div>
          </div>

          {/* Sidebar Tools */}
          <div className="w-80 hidden md:flex bg-slate-900 border-l border-white/10 p-6 flex-col gap-6">
             <div className="bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-neon-blue/30 p-4 rounded-xl shadow-[0_0_15px_rgba(188,19,254,0.1)]">
                <h3 className="text-neon-blue font-bold mb-2 flex items-center gap-2">🤖 AI Security & Tutor</h3>
                <p className="text-sm text-gray-200 leading-relaxed">{tip ? tip : "Đang phân tích bảo mật..."}</p>
             </div>

             <div className="flex-1">
               <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                 Tracking Log
               </h3>
               <ul className="space-y-2 text-xs font-mono text-gray-500">
                 <li className="text-green-500">> Session started: {new Date().toLocaleTimeString()}</li>
                 <li className="text-green-500">> Device ID verified</li>
                 <li className="text-green-500">> DRM Signature valid</li>
                 <li className="animate-pulse">> Monitoring clipboard...</li>
               </ul>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Reader;