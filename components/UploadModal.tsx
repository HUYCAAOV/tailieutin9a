import React, { useState } from 'react';
import { DocType } from '../types';
import { analyzeDocument } from '../services/geminiService';

interface UploadModalProps {
  onUpload: (data: any) => void;
  onCancel: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onUpload, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [type, setType] = useState<DocType>(DocType.NOTES);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiData, setAiData] = useState<{ summary: string; tags: string[] } | null>(null);

  const handleAIAnalyze = async () => {
    if (!title || !description) return;
    setIsAnalyzing(true);
    const result = await analyzeDocument(title, description);
    setAiData({ summary: result.summary, tags: result.suggestedTags });
    setPrice(result.suggestedPrice);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      title,
      description,
      price,
      type,
      tags: aiData?.tags || [],
      aiSummary: aiData?.summary || '',
      thumbnailUrl: `https://picsum.photos/seed/${title}/400/300`, // Mock thumbnail
    });
  };

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 rounded-full blur-[80px] -z-10"></div>

        <h2 className="text-3xl font-bold mb-6 text-white">Đăng Bán Tài Liệu</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tiêu đề tài liệu</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Ví dụ: Đề cương ôn tập Triết học Mác - Lênin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mô tả nội dung (để AI phân tích)</label>
            <textarea 
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Nhập tóm tắt nội dung tài liệu..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={isAnalyzing || !title || !description}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
                ${isAnalyzing ? 'bg-gray-600 cursor-wait' : 'bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-lg hover:shadow-neon-purple/50 text-white'}
              `}
            >
              {isAnalyzing ? 'Đang phân tích...' : '✨ AI Phân tích & Gợi ý giá'}
            </button>
          </div>

          {aiData && (
             <div className="bg-white/5 border border-neon-blue/30 rounded-xl p-4 animate-pulse-glow">
                <h4 className="text-neon-blue text-sm font-bold mb-2">✨ Gợi ý từ AI:</h4>
                <p className="text-gray-300 text-sm mb-2">Summary: {aiData.summary}</p>
                <div className="flex gap-2">
                  {aiData.tags.map(tag => (
                    <span key={tag} className="text-xs bg-neon-blue/10 text-neon-blue px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
             </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Loại tài liệu</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as DocType)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
              >
                {Object.values(DocType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Giá (Credits)</label>
              <input 
                type="number" 
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-transparent border border-white/20 text-white rounded-xl font-bold hover:bg-white/5 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-neon-blue hover:text-white hover:scale-105 transition-all shadow-lg"
            >
              Đăng Bán
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadModal;