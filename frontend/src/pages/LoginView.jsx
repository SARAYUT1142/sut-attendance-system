import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { createApiClient } from '../services/api';

const LoginView = ({ token, onAuthSuccess }) => {
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const request = useMemo(() => createApiClient(token), [token]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    const fd = new FormData(e.target);
    try {
      const res = await request('/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)) });
      onAuthSuccess(res.token, res.user);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-12 border border-white text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-linear-to-br from-indigo-600 to-violet-600 rounded-4xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200 rotate-6 hover:rotate-0 transition-transform duration-500">
          <ShieldCheck className="text-white w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">เช็คชื่อ</h2>
        <p className="text-slate-400 mb-10 font-medium text-sm uppercase tracking-[0.2em]">ระบบจัดการการเข้าเรียนlllllll</p>

        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div className="group space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">อีเมลอาจารย์</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input name="email" type="email" required placeholder="example@univ.ac.th" className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all border-2 border-transparent focus:border-indigo-100" />
            </div>
          </div>
          <div className="group space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">รหัสผ่าน</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input name="password" type="password" required placeholder="••••••••" className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all border-2 border-transparent focus:border-indigo-100" />
            </div>
          </div>
          {authError && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake">
              <AlertCircle size={16} /> {authError}
            </div>
          )}
          <button disabled={isLoading} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg shadow-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all duration-300 mt-4">
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <button onClick={() => navigate('/register')} className="mt-10 text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors">
          ยังไม่มีบัญชีใช่ไหม? <span className="text-indigo-600 underline underline-offset-4">สมัครที่นี่</span>
        </button>
      </div>
    </div>
  );
};

export default LoginView;
