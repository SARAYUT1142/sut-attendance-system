const ConfirmDialog = ({ dialog, onClose, onConfirm }) => {
  if (!dialog.open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white max-w-md w-full rounded-[40px] p-8 shadow-2xl border border-white/20">
        <h3 className="text-xl font-black text-slate-900 mb-3">{dialog.title}</h3>
        <p className="text-slate-600 font-medium mb-8">{dialog.message}</p>
        <div className="flex gap-3 justify-end">
          {dialog.type === 'confirm' && (
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-slate-500 font-bold hover:bg-slate-50"
            >
              ยกเลิก
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black shadow-lg hover:bg-indigo-700"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
