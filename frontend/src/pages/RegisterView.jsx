import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { createApiClient } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

const RegisterView = ({ token }) => {
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState({ open: false, type: 'alert', title: '', message: '' });
  const alertActionRef = useRef(null);
  const request = useMemo(() => createApiClient(token), [token]);
  const navigate = useNavigate();

  const showAlert = (message, title = 'แจ้งเตือน', onClose) => {
    alertActionRef.current = onClose || null;
    setDialog({ open: true, type: 'alert', title, message });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    const fd = new FormData(e.target);
    try {
      await request('/auth/register', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)) });
      showAlert('สำเร็จ! เข้าสู่ระบบได้เลย', 'แจ้งเตือน', () => navigate('/login'));
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl p-12 border border-white text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-xl shadow-slate-200">
          <UserPlus size={32} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">สมัครสมาชิก</h2>
        <p className="text-slate-400 mb-10 font-bold text-[10px] uppercase tracking-[0.2em]">บัญชีอาจารย์ใหม่</p>
        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <input name="name" required placeholder="ชื่อ-นามสกุล" className="w-full px-6 py-4 bg-slate-50 rounded-3xl outline-none border-2 border-transparent focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all" />
          <input name="email" type="email" required placeholder="อีเมล" className="w-full px-6 py-4 bg-slate-50 rounded-3xl outline-none border-2 border-transparent focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all" />
          <input name="password" type="password" required placeholder="รหัสผ่าน" className="w-full px-6 py-4 bg-slate-50 rounded-3xl outline-none border-2 border-transparent focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all" />
          <input name="confirmPassword" type="password" required placeholder="ยืนยันรหัสผ่าน" className="w-full px-6 py-4 bg-slate-50 rounded-3xl outline-none border-2 border-transparent focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all" />
          {authError && <p className="text-red-500 text-xs font-bold px-2">{authError}</p>}
          <button disabled={isLoading} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all mt-4">
            สร้างบัญชี
          </button>
        </form>
        <button onClick={() => navigate('/login')} className="mt-8 text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors">กลับไปหน้าเข้าสู่ระบบ</button>
      </div>

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

export default RegisterView;
