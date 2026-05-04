import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QrCode, ArrowLeft } from 'lucide-react';
import { createApiClient } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

const StudentCheckinPage = ({ token }) => {
  const { courseId, sectionId, sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [dialog, setDialog] = useState({ open: false, type: 'alert', title: '', message: '' });
  const alertActionRef = useRef(null);
  const request = useMemo(() => createApiClient(token), [token]);

  useEffect(() => {
    let active = true;
    if (sectionId && sessionId) {
      request(`/sections/${sectionId}/sessions`).then((data) => {
        if (!active) return;
        const found = (data || []).find((item) => String(item.id) === String(sessionId));
        setSession(found || null);
      });
    }
    return () => { active = false; };
  }, [sectionId, sessionId, request]);

  const showAlert = (message, title = 'แจ้งเตือน', onClose) => {
    alertActionRef.current = onClose || null;
    setDialog({ open: true, type: 'alert', title, message });
  };

  const handleSubmit = async (studentId) => {
    if (!sessionId) return;
    try {
      await request('/check-in', { method: 'POST', body: JSON.stringify({ session_id: Number(sessionId), student_id: String(studentId) }) });
      showAlert('เช็คชื่อสำเร็จ!', 'แจ้งเตือน', () => navigate(`/courses/${courseId}/sections/${sectionId}/sessions/${sessionId}`));
    } catch (err) {
      showAlert(err.message, 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-6 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent)]"></div>
      <div className="max-w-sm w-full bg-white rounded-[56px] p-12 text-slate-800 shadow-[0_32px_100px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 border border-white/10 relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200"><QrCode size={32} className="text-white" /></div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">เช็คชื่อ</h2>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">{session?.title}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e.target.student_id.value);
          }}
          className="space-y-8 text-center"
        >
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">รหัสนักศึกษา</label>
            <input name="student_id" required placeholder="0000000000" className="w-full px-6 py-7 bg-slate-50 border-4 border-slate-100 rounded-4xl text-center text-4xl font-black outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner tracking-[0.3em]" />
          </div>
          <button className="w-full bg-indigo-600 text-white py-6 rounded-4xl font-black text-xl shadow-[0_12px_24px_rgba(79,70,229,0.3)] active:scale-95 transition-all hover:bg-indigo-700">บันทึกเวลา</button>
        </form>
      </div>
      <button onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/sessions/${sessionId}`)} className="mt-12 text-indigo-400 font-bold hover:text-white flex items-center gap-2 transition-colors uppercase tracking-[0.3em] text-[10px] border-b-2 border-indigo-400/20 pb-2">
        <ArrowLeft size={16} /> กลับไปหน้าอาจารย์
      </button>

      <ConfirmDialog
        dialog={dialog}
        onClose={() => setDialog({ ...dialog, open: false })}
        onConfirm={() => {
          setDialog({ ...dialog, open: false });
          if (alertActionRef.current) alertActionRef.current();
        }}
      />
    </div>
  );
};

export default StudentCheckinPage;
