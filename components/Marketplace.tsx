import React from 'react';
import TiltCard from './TiltCard';
import { DocumentItem, User } from '../types';

interface MarketplaceProps {
  documents: DocumentItem[];
  user: User;
  onBuy: (doc: DocumentItem) => void;
  isLibrary?: boolean; // Reusing for library view
  onRead?: (doc: DocumentItem) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ documents, user, onBuy, isLibrary = false, onRead }) => {
  const displayDocs = isLibrary 
    ? documents.filter(d => user.library.includes(d.id))
    : documents.filter(d => !user.library.includes(d.id));

  const handleQuickDownload = (e: React.MouseEvent, doc: DocumentItem) => {
    e.stopPropagation();
    
    // Security Check
    if (doc.boundDeviceId && doc.boundDeviceId !== user.deviceId) {
        alert("❌ LỖI BẢO MẬT: Bạn không thể tải tài liệu này trên thiết bị lạ.");
        return;
    }

    const content = `SECURE DOWNLOAD\nUser: ${user.name}\nDevice: ${user.deviceId}\n\nTitle: ${doc.title}\nDescription: ${doc.description}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title}_SECURE.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green-400">
            {isLibrary ? "Kho Tài Liệu Của Tôi" : "Chợ Tài Liệu"}
          </span>
          <span className="text-3xl">{isLibrary ? "🎓" : "🪐"}</span>
        </h2>
        
        {isLibrary && (
            <div className="mb-8 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg flex items-center gap-2 text-sm text-blue-200">
                <span>ℹ️</span>
                <span>Các tài liệu trong kho này được bảo vệ bởi DRM và chỉ có thể mở trên thiết bị này ({user.deviceId}).</span>
            </div>
        )}

        {displayDocs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <div className="text-6xl mb-4">🌪️</div>
            <p className="text-xl text-gray-400">Chưa có tài liệu nào ở đây.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayDocs.map((doc) => (
              <TiltCard key={doc.id} className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col h-full group hover:border-neon-blue/50">
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 shadow-lg">
                  <img src={doc.thumbnailUrl} alt={doc.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-white/20">
                    {doc.type}
                  </div>
                  {isLibrary && doc.boundDeviceId && (
                      <div className="absolute top-2 left-2 bg-green-900/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-green-400 border border-green-500/50 flex items-center gap-1">
                          🔒 Locked
                      </div>
                  )}
                  {doc.aiSummary && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 pt-8">
                       <p className="text-xs text-gray-300 italic line-clamp-2">"{doc.aiSummary}"</p>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-neon-blue transition-colors">{doc.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">{doc.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <img src={`https://ui-avatars.com/api/?name=${doc.author}&background=random`} className="w-6 h-6 rounded-full" alt="author" />
                    <span className="text-xs text-gray-400">{doc.author}</span>
                  </div>
                  
                  {isLibrary ? (
                    <div className="flex gap-2">
                       <button 
                        onClick={(e) => handleQuickDownload(e, doc)}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        title="Tải nhanh (Secure)"
                       >
                        ⬇️
                       </button>
                       <button 
                        onClick={() => onRead && onRead(doc)}
                        className="px-4 py-2 bg-neon-purple text-white text-sm font-bold rounded-lg shadow-lg hover:bg-neon-pink transition-colors"
                       >
                        Đọc
                       </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => onBuy(doc)}
                      className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-lg shadow-lg hover:bg-neon-blue hover:text-white transition-all flex items-center gap-1"
                    >
                      {doc.price === 0 ? "Miễn Phí" : `${doc.price} CR`}
                    </button>
                  )}
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;