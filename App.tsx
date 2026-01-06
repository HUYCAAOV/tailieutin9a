import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marketplace from './components/Marketplace';
import UploadModal from './components/UploadModal';
import Reader from './components/Reader';
import Login from './components/Login';
import { getDeviceId, verifyDeviceBinding } from './utils/security';
import { DocumentItem, DocType, User, ViewState } from './types';

// Mock Data
const MOCK_DOCS: DocumentItem[] = [
  {
    id: '1',
    title: 'Giải Tích 1 - Full Công Thức',
    description: 'Tổng hợp toàn bộ công thức giải tích 1 kèm ví dụ minh họa dễ hiểu.',
    price: 50,
    author: 'MinhDev',
    type: DocType.NOTES,
    tags: ['#Toan', '#DaiHoc'],
    thumbnailUrl: 'https://picsum.photos/seed/math/400/300',
    purchased: false,
    rating: 4.5,
    aiSummary: 'Bí kíp qua môn Giải Tích dễ dàng.',
    boundDeviceId: undefined
  },
  {
    id: '2',
    title: 'Lịch Sử Đảng - Đề Trắc Nghiệm',
    description: 'Bộ 500 câu hỏi trắc nghiệm ôn thi cuối kỳ có đáp án chi tiết.',
    price: 80,
    author: 'LanAnh',
    type: DocType.EXAM,
    tags: ['#LichSu', '#TracNghiem'],
    thumbnailUrl: 'https://picsum.photos/seed/history/400/300',
    purchased: false,
    rating: 4.8,
    aiSummary: 'Ngân hàng câu hỏi trắc nghiệm đầy đủ nhất.',
    boundDeviceId: undefined
  },
  {
    id: '3',
    title: 'Slide Thuyết Trình Kỹ Năng Mềm',
    description: 'Slide Powerpoint thiết kế đẹp, hiện đại về chủ đề Giao tiếp.',
    price: 120,
    author: 'DesignPro',
    type: DocType.SLIDE,
    tags: ['#SoftSkills', '#PPT'],
    thumbnailUrl: 'https://picsum.photos/seed/ppt/400/300',
    purchased: false,
    rating: 5.0,
    aiSummary: 'Mẫu slide ấn tượng cho bài thuyết trình nhóm.',
    boundDeviceId: undefined
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>('HOME');
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCS);
  
  // Default user state, will be updated on login
  const [user, setUser] = useState<User>({
    id: 'u1',
    name: 'Guest',
    balance: 0,
    library: [],
    deviceId: ''
  });
  
  const [currentReadingDoc, setCurrentReadingDoc] = useState<DocumentItem | null>(null);

  const handleLogin = (key: string, deviceId: string) => {
    let userData: User = {
        id: 'guest',
        name: 'Guest',
        balance: 0,
        library: [],
        deviceId: deviceId
    };

    if (key === 'vip123@') {
      userData = {
        id: 'vip_user',
        name: 'VIP Member 👑',
        balance: 9999, // VIP gets lots of credits
        library: [],
        deviceId: deviceId
      };
    } else if (key === 'test123@') {
      userData = {
        id: 'test_user',
        name: 'Member',
        balance: 500, // Standard test balance
        library: [],
        deviceId: deviceId
      };
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleBuy = (doc: DocumentItem) => {
    if (user.library.includes(doc.id)) return;
    if (user.balance < doc.price) {
      alert("Số dư không đủ! Hãy nạp thêm Credits.");
      return;
    }

    const confirm = window.confirm(`BẢO MẬT: Mua "${doc.title}" sẽ KHÓA tài liệu này vào thiết bị hiện tại (${user.deviceId}). Bạn không thể xem ở máy khác. Tiếp tục?`);
    if (confirm) {
      // Update User Balance
      setUser(prev => ({
        ...prev,
        balance: prev.balance - doc.price,
        library: [...prev.library, doc.id]
      }));

      // Update Document: Bind to Device ID (DRM)
      setDocuments(prevDocs => prevDocs.map(d => {
          if (d.id === doc.id) {
              return { ...d, boundDeviceId: user.deviceId };
          }
          return d;
      }));

      // Auto switch to library to show purchase
      setView('LIBRARY');
    }
  };

  const handleUpload = (data: any) => {
    const newDoc: DocumentItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      author: user.name,
      purchased: false,
      rating: 0,
      boundDeviceId: user.deviceId // Creator owns it on this device
    };
    setDocuments([newDoc, ...documents]);
    // Allow user to own their uploaded doc
    setUser(prev => ({...prev, library: [...prev.library, newDoc.id]}));
    setView('MARKET');
  };

  const handleRead = (doc: DocumentItem) => {
    // SECURITY CHECK: DRM
    // If the doc is bound to a device ID, check if it matches the current user's device ID
    if (doc.boundDeviceId && doc.boundDeviceId !== user.deviceId) {
        alert(`❌ TRUY CẬP BỊ TỪ CHỐI!\n\nTài liệu này đã được đăng ký cho thiết bị: ${doc.boundDeviceId}\nThiết bị hiện tại: ${user.deviceId}\n\nVi phạm chính sách bảo mật.`);
        return;
    }

    setCurrentReadingDoc(doc);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-[#050b14] min-h-screen text-white font-sans selection:bg-neon-pink selection:text-white">
      <Navbar currentView={view} setView={setView} user={user} />
      
      {view === 'HOME' && <Hero setView={setView} />}
      
      {view === 'MARKET' && (
        <Marketplace 
          documents={documents} 
          user={user} 
          onBuy={handleBuy} 
        />
      )}

      {view === 'LIBRARY' && (
        <Marketplace 
          documents={documents} 
          user={user} 
          onBuy={handleBuy} 
          isLibrary={true}
          onRead={handleRead}
        />
      )}

      {view === 'UPLOAD' && (
        <UploadModal 
          onUpload={handleUpload} 
          onCancel={() => setView('HOME')} 
        />
      )}

      {currentReadingDoc && (
        <Reader 
          doc={currentReadingDoc} 
          user={user}
          onClose={() => setCurrentReadingDoc(null)} 
        />
      )}
    </div>
  );
};

export default App;