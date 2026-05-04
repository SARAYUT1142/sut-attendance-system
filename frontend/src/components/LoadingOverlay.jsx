const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center">
    <div className="bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
        </div>
      </div>
      <p className="text-slate-600 font-bold tracking-tight animate-pulse text-sm">กำลังประมวลผล...</p>
    </div>
  </div>
);

export default LoadingOverlay;
