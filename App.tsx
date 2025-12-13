import React, { useState, useEffect } from 'react';
import { SingleImageUploader, MultiImageUploader } from './components/ImageUploader';
import { ASPECT_RATIOS, CAMERA_ANGLES, CATEGORIES } from './constants';
import { AppState, AspectRatio, ConceptCategory, GeneratedImage } from './types';
import { generateImage } from './services/geminiService';

export default function App() {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  const [state, setState] = useState<AppState>({
    sourceImage: null,
    refImages: [],
    isSourceFaceLock: true,
    isRefFaceLock: false,
    selectedCategory: ConceptCategory.Noel,
    selectedConceptId: CATEGORIES[ConceptCategory.Noel][0].id,
    selectedAngleId: CAMERA_ANGLES[1].id, // Eye-level
    selectedRatio: AspectRatio.Portrait,
    additionalDetails: "",
    isGenerating: false,
    results: []
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        if ((window as any).aistudio) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else {
          // Fallback for local dev or if script missing, assuming env var might be set manually
          setHasApiKey(!!process.env.API_KEY);
        }
      } catch (e) {
        console.error("Error checking API key:", e);
      } finally {
        setIsCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const handleStartApp = async () => {
    if ((window as any).aistudio) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Assume success to mitigate race condition
        setHasApiKey(true);
      } catch (error) {
        console.error("Key selection failed", error);
        alert("Vui lòng chọn API Key để tiếp tục.");
      }
    } else {
      alert("Môi trường không hỗ trợ chọn Key tự động.");
    }
  };

  const handleGenerate = async () => {
    if (!state.sourceImage && state.refImages.length === 0 && !state.additionalDetails) {
      alert("Vui lòng tải ảnh lên hoặc nhập mô tả.");
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, results: [] }));

    try {
      // Find selected concept and angle prompts
      const conceptList = CATEGORIES[state.selectedCategory];
      const concept = conceptList.find(c => c.id === state.selectedConceptId);
      const angle = CAMERA_ANGLES.find(a => a.id === state.selectedAngleId);

      const params = {
        sourceImage: state.sourceImage,
        refImages: state.refImages,
        isSourceFaceLock: state.isSourceFaceLock,
        conceptPrompt: concept ? concept.prompt : "",
        anglePrompt: angle ? angle.prompt : "",
        ratio: state.selectedRatio,
        details: state.additionalDetails
      };

      // Generate 2 images independently to get variety (since generateContent often returns 1 best result)
      // Running in parallel
      const promises = [generateImage(params), generateImage(params)];
      const results = await Promise.all(promises);

      const newImages: GeneratedImage[] = results.map((url, index) => ({
        id: Date.now().toString() + index,
        url: url
      }));

      setState(prev => ({ ...prev, results: newImages, isGenerating: false }));
    } catch (error: any) {
      console.error(error);
      let msg = "Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.";
      
      const errorStr = JSON.stringify(error);
      if (error.message?.includes("403") || error.message?.includes("PERMISSION_DENIED") || errorStr.includes("PERMISSION_DENIED")) {
        msg = "Lỗi quyền truy cập (403). Mô hình tạo ảnh yêu cầu API Key từ dự án có tính phí (Billing Enabled Project). Vui lòng chọn Key khác.";
        // Reset key state to force re-selection if permission denied
        setHasApiKey(false);
      }
      
      alert(msg);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // Welcome / API Key Selection Screen
  if (!hasApiKey && !isCheckingKey) {
    return (
      <div className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-blue-950 p-8 rounded-2xl border border-yellow-600 shadow-2xl max-w-md w-full">
          <h1 className="text-4xl font-bold text-yellow-500 mb-2 uppercase tracking-wider">Tạo ảnh vui xuân Pro</h1>
          <p className="text-gray-300 mb-6 italic">Ứng dụng tạo ảnh Noel và Tết Việt Nam sử dụng AI</p>
          
          <div className="mb-6 space-y-3 text-sm text-gray-200 bg-blue-900/50 p-4 rounded border border-blue-800">
             <p>Để tạo ảnh chất lượng cao, bạn cần kết nối <strong>API Key</strong> từ Google AI Studio.</p>
             <p className="text-xs text-yellow-500 font-bold">Lưu ý: Bạn nên sử dụng API Key từ dự án có liên kết thanh toán (Paid Project) để truy cập đầy đủ tính năng Pro.</p>
             <a 
               href="https://ai.google.dev/gemini-api/docs/billing" 
               target="_blank" 
               rel="noreferrer"
               className="text-xs text-blue-300 underline hover:text-white block mt-1"
             >
               Xem tài liệu về Billing & Pricing
             </a>
          </div>

          <button 
            onClick={handleStartApp}
            className="w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-transform transform active:scale-95"
          >
            Kết nối API Key & Bắt đầu
          </button>

          <div className="mt-8 pt-4 border-t border-blue-800 text-xs text-gray-500">
            Phát triển bởi Nguyễn Văn Thành
          </div>
        </div>
      </div>
    );
  }

  // Loading state while checking key
  if (isCheckingKey) {
     return <div className="min-h-screen bg-blue-900 flex items-center justify-center text-yellow-500">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="bg-blue-950 p-4 border-b border-yellow-600 shadow-lg sticky top-0 z-50">
        <h1 className="text-3xl md:text-4xl text-center font-bold text-yellow-500 uppercase tracking-wider drop-shadow-md">
          Tạo ảnh vui xuân Pro
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Input */}
        <div className="bg-blue-900/50 p-4 rounded-xl border border-blue-700 shadow-xl overflow-y-auto max-h-[140vh]">
          
          <SingleImageUploader 
            label="1. Ảnh Gốc (Chính)"
            image={state.sourceImage}
            onImageChange={(file) => setState(prev => ({...prev, sourceImage: file}))}
            isLocked={state.isSourceFaceLock}
            onLockToggle={() => setState(prev => ({...prev, isSourceFaceLock: !prev.isSourceFaceLock}))}
          />

          <MultiImageUploader 
            label="2. Ảnh Tham Chiếu (Tối đa 5)"
            images={state.refImages}
            onImagesChange={(files) => setState(prev => ({...prev, refImages: files}))}
            isLocked={state.isRefFaceLock}
            onLockToggle={() => setState(prev => ({...prev, isRefFaceLock: !prev.isRefFaceLock}))}
          />

          {/* Menu Categories */}
          <div className="mb-4 space-y-3">
            <h3 className="font-bold text-yellow-500 text-lg border-b border-yellow-600/50 pb-1">3. Tùy Chọn Bối Cảnh</h3>
            
            {/* Category Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {Object.values(ConceptCategory).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setState(prev => ({
                    ...prev, 
                    selectedCategory: cat, 
                    selectedConceptId: CATEGORIES[cat][0].id
                  }))}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${
                    state.selectedCategory === cat 
                      ? 'bg-yellow-600 border-yellow-400 text-white shadow-[0_0_10px_rgba(234,179,8,0.5)]' 
                      : 'bg-blue-800 border-blue-600 text-gray-300 hover:bg-blue-700'
                  }`}
                >
                  {cat === 'Noel' ? '🎄 Noel' : 
                   cat === 'Tet' ? '🧧 Tết Việt' : 
                   cat === 'DuXuan' ? '🌸 Du Xuân' : 
                   cat === 'SumVay' ? '👨‍👩‍👧‍👦 Sum Vầy' : '❄️ Mùa Đông'}
                </button>
              ))}
            </div>

            {/* Concept List Scrollable */}
            <div className="h-48 overflow-y-auto bg-blue-800 rounded border border-blue-700 p-2 space-y-1">
              {CATEGORIES[state.selectedCategory].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setState(prev => ({...prev, selectedConceptId: item.id}))}
                  className={`p-2 rounded cursor-pointer text-sm transition-colors ${
                    state.selectedConceptId === item.id 
                      ? 'bg-yellow-600/30 border border-yellow-600 text-yellow-300 font-bold' 
                      : 'hover:bg-blue-700 text-gray-200'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
             {/* Angles */}
             <div>
                <label className="block text-yellow-500 font-bold mb-1">4. Góc Máy</label>
                <select 
                  className="w-full bg-blue-800 border border-yellow-600 text-white rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={state.selectedAngleId}
                  onChange={(e) => setState(prev => ({...prev, selectedAngleId: e.target.value}))}
                >
                  {CAMERA_ANGLES.map(a => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
             </div>

             {/* Ratios */}
             <div>
                <label className="block text-yellow-500 font-bold mb-1">5. Tỉ lệ khung hình</label>
                <select 
                  className="w-full bg-blue-800 border border-yellow-600 text-white rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={state.selectedRatio}
                  onChange={(e) => setState(prev => ({...prev, selectedRatio: e.target.value as AspectRatio}))}
                >
                  {ASPECT_RATIOS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
             </div>
          </div>

          {/* Details */}
          <div className="mb-6">
            <label className="block text-yellow-500 font-bold mb-1">6. Thêm Chi Tiết (Tùy chọn)</label>
            <textarea 
               className="w-full bg-blue-800 border border-yellow-600 text-white rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
               rows={3}
               placeholder="Mô tả thêm: màu áo, tâm trạng, phụ kiện..."
               value={state.additionalDetails}
               onChange={(e) => setState(prev => ({...prev, additionalDetails: e.target.value}))}
            />
          </div>

          {/* Sticky CTA */}
          <div className="sticky bottom-0 bg-blue-900/90 p-4 border-t border-yellow-600/30 backdrop-blur-sm -mx-4 -mb-4 rounded-b-xl">
             <button 
               onClick={handleGenerate}
               disabled={state.isGenerating}
               className={`w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all transform active:scale-95 ${
                 state.isGenerating 
                  ? 'bg-gray-600 cursor-wait text-gray-300' 
                  : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white'
               }`}
             >
               {state.isGenerating ? 'Đang Khởi Tạo Phép Màu...' : '✨ TẠO ẢNH NGAY ✨'}
             </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="flex flex-col gap-4">
           <h2 className="text-xl font-bold text-yellow-500 border-b border-yellow-600 pb-2">KẾT QUẢ TÁC PHẨM</h2>
           
           <div className="grid grid-cols-1 gap-6 flex-grow">
              {state.results.length === 0 && !state.isGenerating && (
                <div className="h-96 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center text-gray-400 flex-col gap-2">
                   <span className="text-4xl">🖼️</span>
                   <p>Kết quả sẽ hiển thị tại đây</p>
                </div>
              )}

              {state.isGenerating && (
                <div className="h-96 flex flex-col items-center justify-center text-yellow-500 animate-pulse">
                   <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-lg">Đang vẽ tranh mùa xuân...</p>
                </div>
              )}

              {state.results.map((img, idx) => (
                <div key={img.id} className="relative group bg-black rounded-lg overflow-hidden border-2 border-yellow-600 shadow-2xl">
                   <img src={img.url} alt={`Generated ${idx}`} className="w-full h-auto object-contain max-h-[600px] mx-auto" />
                   
                   {/* Watermark */}
                   <div className="absolute bottom-1 right-2 pointer-events-none opacity-50 text-[10px] text-white drop-shadow-md">
                      App này được tạo bởi Nguyễn Văn Thành-Gv trường THCS Ngãi Tứ
                   </div>

                   {/* Actions Overlay */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={() => setPreviewImage(img.url)}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition"
                        title="Phóng to"
                      >
                         🔍
                      </button>
                      <a 
                        href={img.url} 
                        download={`xuan-pro-${idx}.png`}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition"
                        title="Tải về"
                      >
                         ⬇️
                      </a>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 border-t border-yellow-600 mt-8 py-8 text-center text-white">
        <div className="container mx-auto px-4">
           <h3 className="text-xl font-bold text-yellow-500 mb-2">Nguyễn Văn Thành - GV trường THCS Ngãi Tứ</h3>
           <p className="text-gray-300 mb-4 max-w-2xl mx-auto italic">
             "Giúp cho cộng đồng những người yêu vẻ đẹp của Noel và Tết. Có Công Cụ thông minh tạo ra những tấm ảnh ngoài sự mong đợi."
           </p>
           
           <div className="inline-block border border-yellow-600 rounded-full px-6 py-2 bg-blue-900/50 hover:bg-blue-800 transition">
              <span className="font-bold text-yellow-500 mr-2">Zalo Hỗ Trợ:</span>
              <a href="https://zalo.me/0986738320" target="_blank" rel="noreferrer" className="text-white hover:text-yellow-300 hover:underline">
                 0986 738 320
              </a>
           </div>
        </div>
      </footer>

      {/* Fullscreen Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Full Preview" className="max-w-full max-h-full rounded shadow-2xl" />
          <button className="absolute top-4 right-4 text-white text-4xl">&times;</button>
        </div>
      )}
    </div>
  );
}