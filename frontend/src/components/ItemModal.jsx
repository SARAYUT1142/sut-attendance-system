import { Plus } from 'lucide-react';

const ItemModal = ({ isOpen, modalType, editingItem, getModalTitle, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white max-w-md w-full rounded-[56px] p-12 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            {getModalTitle()}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300"
          >
            <Plus size={24} className="rotate-45" />
          </button>
        </div>
        <form className="space-y-5" onSubmit={onSubmit}>
          {modalType.includes('Course') && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ชื่อคอร์ส</label>
                <input
                  name="name"
                  required
                  placeholder="วิทยาการคอมพิวเตอร์ 101"
                  defaultValue={editingItem?.name || ''}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">เทอม</label>
                  <input
                    name="term"
                    required
                    placeholder="1"
                    defaultValue={editingItem?.term || ''}
                    className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ปีการศึกษา</label>
                  <input
                    name="year"
                    required
                    placeholder="2567"
                    defaultValue={editingItem?.year || ''}
                    className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                  />
                </div>
              </div>
            </>
          )}
          {modalType.includes('Sec') && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ชื่อกลุ่มเรียน</label>
              <input
                name="name"
                required
                placeholder="เช้า (A1)"
                defaultValue={editingItem?.name || ''}
                className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
              />
            </div>
          )}
          {(modalType === 'addSession' || modalType === 'editSession') && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ชื่อคาบเรียน</label>
                <input
                  name="title"
                  required
                  placeholder="คาบที่ 1: บทนำ"
                  defaultValue={editingItem?.title || ''}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">วันที่</label>
                <input
                  name="date"
                  required
                  type="date"
                  defaultValue={editingItem?.date || ''}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                />
              </div>
            </>
          )}
          {modalType.includes('Student') && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">รหัสนักศึกษา</label>
                <input
                  name="studentId"
                  required
                  placeholder="6501XXXX"
                  defaultValue={editingItem?.id || ''}
                  readOnly={modalType === 'editStudent'}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ชื่อ-นามสกุล</label>
                <input
                  name="name"
                  required
                  placeholder="สมชาย ใจดี"
                  defaultValue={editingItem?.name || ''}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
                />
              </div>
            </>
          )}
          <div className="flex gap-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs hover:bg-slate-50 rounded-[20px] transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-4 rounded-[20px] font-black shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all uppercase tracking-widest text-xs"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
