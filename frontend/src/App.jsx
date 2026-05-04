import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, BookOpen, Plus, QrCode, ChevronRight, LogOut, Trash2, 
  UserPlus, FileUp, ArrowLeft, Edit, Download, ShieldCheck, 
  Calendar, Search, Mail, Lock, Square, Play, Check, X, AlertCircle
} from 'lucide-react';


//  แก้ base API ตามที่ backend รันอยู่ ก่อน deploy จริงอย่าลืมเปลี่ยนเป็น URL จริง
const API_BASE = "http://localhost:8080/api";



// --- Shared Components ---

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

// --- Sub-Views (Declared outside for performance and ESLint compliance) ---

const LoginView = ({ handleLogin, setView, authError, isLoading }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
    <div className="max-w-md w-full bg-white rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-12 border border-white text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200 rotate-6 hover:rotate-0 transition-transform duration-500">
        <ShieldCheck className="text-white w-12 h-12" />
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">เช็คชื่อ</h2>
      <p className="text-slate-400 mb-10 font-medium text-sm uppercase tracking-[0.2em]">ระบบจัดการการเข้าเรียน</p>
      
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
        {authError && <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake"><AlertCircle size={16}/> {authError}</div>}
        <button disabled={isLoading} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg shadow-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all duration-300 mt-4">
          {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
      <button onClick={() => setView('register')} className="mt-10 text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors">
        ยังไม่มีบัญชีใช่ไหม? <span className="text-indigo-600 underline underline-offset-4">สมัครที่นี่</span>
      </button>
    </div>
  </div>
);

const RegisterView = ({ handleRegister, setView, authError, isLoading }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl p-12 border border-white text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-xl shadow-slate-200">
        <UserPlus size={32} />
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">สมัครสมาชิก</h2>
      <p className="text-slate-400 mb-10 font-bold text-[10px] uppercase tracking-[0.2em]">บัญชีอาจารย์ใหม่</p>
      <form onSubmit={handleRegister} className="space-y-4 text-left">
        <input name="name" required placeholder="ชื่อ-นามสกุล" className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all" />
        <input name="email" type="email" required placeholder="อีเมล" className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all" />
        <input name="password" type="password" required placeholder="รหัสผ่าน" className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all" />
        <input name="confirmPassword" type="password" required placeholder="ยืนยันรหัสผ่าน" className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all" />
        {authError && <p className="text-red-500 text-xs font-bold px-2">{authError}</p>}
        <button disabled={isLoading} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl hover:bg-indigo-700 transition-all mt-4">
          สร้างบัญชี
        </button>
      </form>
      <button onClick={() => setView('login')} className="mt-8 text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors">กลับไปหน้าเข้าสู่ระบบ</button>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [view, setView] = useState(token ? 'dashboard' : 'login'); 
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Data States
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [attendances, setAttendances] = useState([]);

  // UI States
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialog, setDialog] = useState({ open: false, type: 'alert', title: '', message: '' });
  const confirmActionRef = useRef(null);

  // --- API Utility ---
  const request = useCallback(async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      ...(!options.isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  }, [token]);

  // --- Data Fetching Hooks (Fixed linter warnings) ---
  useEffect(() => {
    let active = true;
    if (token && view === 'dashboard') {
      request('/courses').then(data => { if (active) setCourses(data || []); });
    }
    return () => { active = false; };
  }, [token, view, request]);

  useEffect(() => {
    let active = true;
    if (selectedCourse) {
      request(`/courses/${selectedCourse.id}/sections`).then(data => { if (active) setSections(data || []); });
    }
    return () => { active = false; };
  }, [selectedCourse, request]);

  useEffect(() => {
    let active = true;
    if (selectedSection) {
      Promise.all([
        request(`/sections/${selectedSection.id}/students`),
        request(`/sections/${selectedSection.id}/sessions`)
      ]).then(([stds, sess]) => {
        if (active) { setStudents(stds || []); setSessions(sess || []); }
      });
    }
    return () => { active = false; };
  }, [selectedSection, request]);

  useEffect(() => {
    let active = true;
    if (selectedSession) {
      request(`/sessions/${selectedSession.id}/report`).then(data => { if (active) setAttendances(data || []); });
    }
    return () => { active = false; };
  }, [selectedSession, request]);

  // --- Handlers ---

  const showAlert = (message, title = 'แจ้งเตือน') => {
    setDialog({ open: true, type: 'alert', title, message });
  };

  const showConfirm = (message, onConfirm, title = 'ยืนยันการทำรายการ') => {
    confirmActionRef.current = onConfirm;
    setDialog({ open: true, type: 'confirm', title, message });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    const fd = new FormData(e.target);
    try {
      const res = await request('/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)) });
      setToken(res.token);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setView('dashboard');
    } catch (err) { setAuthError(err.message); } finally { setIsLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.target);
    try {
      await request('/auth/register', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)) });
      showAlert('สำเร็จ! เข้าสู่ระบบได้เลย');
      setView('login');
    } catch (err) { setAuthError(err.message); } finally { setIsLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setView('login');
  };

  const handleDelete = async (type, id) => {
    showConfirm('ยืนยันการลบ?', async () => {
      try {
        if (type === 'course') { await request(`/courses/${id}`, { method: 'DELETE' }); const d = await request('/courses'); setCourses(d || []); }
        else if (type === 'section') { await request(`/sections/${id}`, { method: 'DELETE' }); const d = await request(`/courses/${selectedCourse.id}/sections`); setSections(d || []); }
        else if (type === 'session') { 
          await request(`/sessions/${id}`, { method: 'DELETE' }); 
          const d = await request(`/sections/${selectedSection.id}/sessions`); 
          setSessions(d || []);
          if (selectedSession?.id === id) setView('section'); 
        }
        else if (type === 'student') { 
          await request(`/sections/${selectedSection.id}/students/${id}`, { method: 'DELETE' }); 
          const d = await request(`/sections/${selectedSection.id}/students`);
          setStudents(d || []);
        }
      } catch (err) { showAlert(err.message, 'เกิดข้อผิดพลาด'); }
    });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd);
    try {
      if (modalType === 'addCourse') await request('/courses', { method: 'POST', body: JSON.stringify(body) });
      else if (modalType === 'editCourse') await request(`/courses/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(body) });
      else if (modalType === 'addSec') await request('/sections', { method: 'POST', body: JSON.stringify({ ...body, course_id: selectedCourse.id }) });
      else if (modalType === 'addSession') await request('/sessions', { method: 'POST', body: JSON.stringify({ ...body, section_id: selectedSection.id }) });
      else if (modalType === 'editSession') await request(`/sessions/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(body) });
      else if (modalType === 'editSec') await request(`/sections/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(body) });
      else if (modalType === 'editStudent') {
        await request(`/sections/${selectedSection.id}/students/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: body.name })
        });
      }
      else if (modalType === 'addStudent') {
        await request(`/sections/${selectedSection.id}/students`, {
          method: 'POST',
          body: JSON.stringify({ id: body.studentId, name: body.name })
        });
      }
      
      if (selectedSection) {
        const [stds, sess] = await Promise.all([request(`/sections/${selectedSection.id}/students`), request(`/sections/${selectedSection.id}/sessions`)]);
        setStudents(stds || []); setSessions(sess || []);
      } else if (selectedCourse) {
        const d = await request(`/courses/${selectedCourse.id}/sections`); setSections(d || []);
      } else {
        const d = await request('/courses'); setCourses(d || []);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) { showAlert(err.message, 'เกิดข้อผิดพลาด'); }
  };

  const toggleCheckIn = async () => {
    try {
      await request(`/sessions/${selectedSession.id}/toggle`, { method: 'PATCH' });
      const d = await request(`/sections/${selectedSection.id}/sessions`);
      setSessions(d || []);
      setSelectedSession(prev => ({ ...prev, is_open: !prev.is_open }));
    } catch (err) { showAlert(err.message, 'เกิดข้อผิดพลาด'); }
  };

  const handleExportExcel = () => {
    if (!selectedSession) return;
    let csvContent = "\uFEFFรหัส,ชื่อ,สถานะ,เวลา\n";
    students.forEach((std) => {
      const att = attendances.find((a) => a.student_id === std.id);
      csvContent += `${std.id},${std.name},${att ? 'มาเรียน' : 'ขาดเรียน'},${att ? att.check_time : '-'}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `รายงาน_${selectedSession.title}.csv`;
    link.click();
  };

  const filteredStudents = students.filter((std) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const name = String(std.name || '').toLowerCase();
    const id = String(std.id || '').toLowerCase();
    return name.includes(term) || id.includes(term);
  });

  const modalLabelMap = {
    addCourse: 'คอร์ส',
    editCourse: 'คอร์ส',
    addSec: 'กลุ่มเรียน',
    editSec: 'กลุ่มเรียน',
    addSession: 'คาบเรียน',
    editSession: 'คาบเรียน',
    addStudent: 'นักศึกษา',
    editStudent: 'นักศึกษา',
  };

  const getModalTitle = () => {
    const action = editingItem ? 'แก้ไข' : 'เพิ่ม';
    const label = modalLabelMap[modalType] || 'รายการ';
    return `${action} ${label}`;
  };

  // --- Views Renderer ---

  const renderContent = () => {
    switch(view) {
      case 'login': return <LoginView handleLogin={handleLogin} setView={setView} authError={authError} isLoading={isLoading} />;
      case 'register': return <RegisterView handleRegister={handleRegister} setView={setView} authError={authError} isLoading={isLoading} />;
      case 'dashboard': return (
        <div className="min-h-screen bg-slate-50">
          <nav className="bg-white/80 backdrop-blur-md px-8 py-5 flex justify-between items-center shadow-sm sticky top-0 z-10 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-[14px] text-white shadow-lg shadow-indigo-100"><BookOpen size={20} /></div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">พอร์ทัลอาจารย์</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-none">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100"><LogOut size={18} /></button>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">คอร์สของฉัน</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">จัดการรายวิชาที่สอน</p>
              </div>
              <button onClick={() => { setModalType('addCourse'); setEditingItem(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-[24px] font-black shadow-2xl shadow-indigo-100 flex items-center gap-2 hover:bg-slate-900 transition-all hover:-translate-y-1">
                <Plus size={20} /> เพิ่มคอร์ส
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <div key={course.id} onClick={() => { setSelectedCourse(course); setView('course'); }} className="bg-white p-8 rounded-[48px] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setEditingItem(course); setModalType('editCourse'); setIsModalOpen(true); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm"><Edit size={16}/></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete('course', course.id); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-white shadow-sm"><Trash2 size={16}/></button>
                  </div>
                  <div className="w-16 h-16 bg-indigo-50 rounded-[24px] flex items-center justify-center text-indigo-600 mb-10 group-hover:scale-110 transition-transform shadow-inner"><BookOpen size={32} /></div>
                  <h3 className="text-2xl font-black text-slate-800 mb-1 leading-tight">{course.name}</h3>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-[10px] font-black tracking-widest uppercase bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">เทอม {course.term}/{course.year}</span>
                    <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full flex items-center gap-1"><Users size={10}/> จัดการ</span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      );
      case 'course': return (
        <div className="min-h-screen bg-slate-50">
          <div className="bg-white px-8 py-5 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10"><button onClick={() => setView('dashboard')} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"><ArrowLeft size={20}/></button><h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">{selectedCourse?.name}</h1></div>
          <main className="max-w-4xl mx-auto p-12">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">จัดการกลุ่มเรียน</h2>
              <button onClick={() => { setModalType('addSec'); setEditingItem(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-6 py-3.5 rounded-[20px] font-black shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-slate-900 active:scale-95 transition-all"><Plus size={18}/> เพิ่มกลุ่มเรียน</button>
            </div>
            <div className="grid gap-6">
              {sections.map(sec => (
                <div key={sec.id} onClick={() => { setSelectedSection(sec); setView('section'); }} className="bg-white p-8 rounded-[40px] flex justify-between items-center group hover:shadow-2xl border border-slate-100 cursor-pointer transition-all hover:-translate-x-1 relative">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-indigo-50 rounded-[24px] flex items-center justify-center text-indigo-600 shadow-inner"><Users size={32} /></div>
                    <div>
                      <h3 className="font-black text-slate-800 text-2xl tracking-tight">{sec.name}</h3>
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">แผงควบคุม</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setEditingItem(sec); setModalType('editSec'); setIsModalOpen(true); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                      <Edit size={16} />
                    </button>
                    <ChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      );
      case 'section': return (
        <div className="min-h-screen bg-slate-50">
          <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('course')} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400"><ArrowLeft size={20}/></button>
              <div><h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">{selectedSection?.name}</h1><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedCourse?.name}</p></div>
            </div>
            <div className="flex gap-3">
                <button onClick={() => { setModalType('addSession'); setEditingItem(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"><Calendar size={18}/> เพิ่มคาบเรียน</button>
            </div>
          </header>
          <main className="max-w-7xl mx-auto p-8 grid lg:grid-cols-2 gap-12">
            <section className="space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4"><Play size={14} className="fill-indigo-500 text-indigo-500"/> คาบเรียนเช็คชื่อ</h3>
              <div className="space-y-5">
                {sessions.map(sess => (
                  <div key={sess.id} onClick={() => { setSelectedSession(sess); setView('session_detail'); }} className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl cursor-pointer flex justify-between items-center transition-all group relative">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${sess.is_open ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                        {sess.is_open ? <QrCode size={24} /> : <Calendar size={24} />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xl leading-tight group-hover:text-indigo-600 transition-colors">{sess.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sess.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setEditingItem(sess); setModalType('editSession'); setIsModalOpen(true); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                        <Edit size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete('session', sess.id); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={16} />
                      </button>
                      <ChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="space-y-8">
              <div className="flex justify-between items-center px-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> รายชื่อนักศึกษา</h3>
                 <div className="flex gap-2">
                   <button onClick={() => { setModalType('addStudent'); setEditingItem(null); setIsModalOpen(true); }} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><UserPlus size={18}/></button>
                   <label className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 cursor-pointer hover:text-indigo-600 shadow-sm transition-all"><FileUp size={18}/><input type="file" accept=".csv" className="hidden" onChange={async (e) => { const fd = new FormData(); fd.append('file', e.target.files[0]); await request(`/sections/${selectedSection.id}/students/import`, { method: 'POST', body: fd, isFormData: true }); const d = await request(`/sections/${selectedSection.id}/students`); setStudents(d || []); showAlert('นำเข้าแล้ว'); }} /></label>
                 </div>
              </div>
              <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <tr><th className="px-10 py-6">รหัสนักศึกษา</th><th className="px-10 py-6">ชื่อ</th><th className="px-10 py-6 text-right">การทำงาน</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {students.map(std => (
                        <tr key={std.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-6 font-mono text-xs text-slate-400 tracking-[0.2em] uppercase">{std.id}</td>
                          <td className="px-10 py-6 font-black text-slate-700 text-lg tracking-tight">{std.name}</td>
                            <td className="px-10 py-6 text-right flex justify-end gap-1">
                              <button onClick={() => { setEditingItem(std); setModalType('editStudent'); setIsModalOpen(true); }} className="p-3 text-slate-200 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-white rounded-2xl shadow-sm"><Edit size={16}/></button>
                              <button onClick={() => handleDelete('student', std.id)} className="p-3 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-white rounded-2xl shadow-sm"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
            </section>
          </main>
        </div>
      );
      case 'session_detail': return (
        <div className="min-h-screen bg-slate-50">
          <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('section')} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"><ArrowLeft size={20}/></button>
              <div><h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{selectedSession?.title}</h1><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedSession?.date}</p></div>
            </div>
            <div className="flex gap-3">
               <button onClick={handleExportExcel} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-900 shadow-xl shadow-emerald-50 transition-all text-xs">
                 <Download size={18}/> ดาวน์โหลดรายงาน
               </button>
               <button onClick={() => handleDelete('session', selectedSession?.id)} className="p-3 text-slate-300 hover:text-red-500 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all"><Trash2 size={20} /></button>
            </div>
          </header>
          <main className="max-w-7xl mx-auto p-8 grid lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
                 <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-12 flex items-center gap-2 underline underline-offset-8 decoration-indigo-100">คิวอาร์เช็คชื่อสด</h2>
                 <div className={`p-12 bg-slate-50 rounded-[48px] border-4 border-dashed border-slate-100 transition-all duration-700 shadow-inner ${selectedSession?.is_open ? 'opacity-100 scale-100' : 'opacity-10 scale-90 grayscale'}`}>
                    <QrCode size={240} className="text-slate-900" />
                 </div>
                 <div className="w-full mt-14 space-y-5">
                    <button 
                      onClick={toggleCheckIn} 
                      className={`w-full py-6 rounded-[32px] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${selectedSession?.is_open ? 'bg-red-50 text-red-600 shadow-red-50 hover:bg-red-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'}`}
                    >
                      {selectedSession?.is_open ? <><Square size={22} fill="currentColor"/> ปิดการเช็คชื่อ</> : <><Play size={22} fill="currentColor"/> เปิดการเช็คชื่อ</>}
                    </button>
                    {selectedSession?.is_open && (
                      <button onClick={() => setView('student_checkin')} className="text-indigo-500 font-bold text-sm tracking-widest uppercase w-full py-4 hover:bg-indigo-50 rounded-2xl transition-colors">
                        จำลองการสแกนของนักศึกษา <ChevronRight size={14} className="inline ml-1" />
                      </button>
                    )}
                 </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[56px] shadow-2xl shadow-indigo-100 flex flex-col gap-8">
                 <div className="flex justify-between items-center text-white">
                    <div><p className="text-[10px] font-black uppercase opacity-60 tracking-widest">อัตราเข้าชั้นเรียน</p><p className="text-5xl font-black tracking-tighter">{attendances.length} / {students.length}</p></div>
                    <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md"><Users size={32}/></div>
                 </div>
                 <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden backdrop-blur-md"><div className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{width: `${(attendances.length / (students.length || 1)) * 100}%`}}></div></div>
              </div>
            </div>
            <div className="lg:col-span-7 bg-white rounded-[56px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">รายชื่อนักศึกษา</h3>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ค้นหาด้วยชื่อ/รหัส..." className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-3xl text-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner w-64" />
                </div>
              </div>
              <div className="overflow-y-auto max-h-[750px]">
                 <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(std => {
                       const att = attendances.find(a => a.student_id === std.id);
                       return (
                         <tr key={std.id} className="hover:bg-indigo-50/20 transition-all group">
                            <td className="px-12 py-8">
                               <p className="font-black text-slate-800 leading-tight text-xl tracking-tight group-hover:text-indigo-600 transition-colors">{std.name}</p>
                               <p className="text-[11px] font-mono text-slate-400 mt-2 uppercase tracking-[0.3em] font-bold">{std.id}</p>
                            </td>
                            <td className="px-12 py-8 text-center">
                               {att ? 
                                 <span className="px-6 py-2.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 w-fit mx-auto shadow-sm border border-emerald-200 scale-100">
                                   <Check size={14} strokeWidth={4} /> มาเรียน
                                 </span> : 
                                 <span className="px-6 py-2.5 bg-slate-100 text-slate-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 w-fit mx-auto border border-slate-200">
                                   <X size={14} strokeWidth={4} /> ขาดเรียน
                                 </span>
                               }
                            </td>
                            <td className="px-12 py-8 text-right font-mono text-xs text-slate-400 italic">
                               {att ? new Date(att.check_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}
                            </td>
                         </tr>
                       );
                    })}
                 </tbody></table>
              </div>
            </div>
          </main>
        </div>
      );
      case 'student_checkin': return (
        <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-6 text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent)]"></div>
          <div className="max-w-sm w-full bg-white rounded-[56px] p-12 text-slate-800 shadow-[0_32px_100px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 border border-white/10 relative z-10">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200"><QrCode size={32} className="text-white"/></div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">เช็คชื่อ</h2>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">{selectedSession?.title}</p>
            </div>
            <form onSubmit={async (e) => { e.preventDefault(); try { await request('/check-in', { method: 'POST', body: JSON.stringify({ session_id: selectedSession.id, student_id: e.target.student_id.value }) }); showAlert('เช็คชื่อสำเร็จ!'); const d = await request(`/sessions/${selectedSession.id}/report`); setAttendances(d || []); setView('session_detail'); } catch (err) { showAlert(err.message, 'เกิดข้อผิดพลาด'); } }} className="space-y-8 text-center">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">รหัสนักศึกษา</label>
                <input name="student_id" required placeholder="0000000000" className="w-full px-6 py-7 bg-slate-50 border-4 border-slate-100 rounded-[32px] text-center text-4xl font-black outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner tracking-[0.3em]" />
              </div>
              <button className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black text-xl shadow-[0_12px_24px_rgba(79,70,229,0.3)] active:scale-95 transition-all hover:bg-indigo-700">บันทึกเวลา</button>
            </form>
          </div>
          <button onClick={() => setView('session_detail')} className="mt-12 text-indigo-400 font-bold hover:text-white flex items-center gap-2 transition-colors uppercase tracking-[0.3em] text-[10px] border-b-2 border-indigo-400/20 pb-2">
            <ArrowLeft size={16} /> กลับไปหน้าอาจารย์
          </button>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="font-sans antialiased text-slate-800 selection:bg-indigo-100">
      {isLoading && <LoadingOverlay />}
      {renderContent()}
      
      {/* Modal - Universal Design */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full rounded-[56px] p-12 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                  {getModalTitle()}
                </h2>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300"><Plus size={24} className="rotate-45" onClick={() => setIsModalOpen(false)} /></div>
            </div>
            <form className="space-y-5" onSubmit={handleModalSubmit}>
              {modalType.includes('Course') && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ชื่อคอร์ส</label><input name="name" required placeholder="วิทยาการคอมพิวเตอร์ 101" defaultValue={editingItem?.name || ''} className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all" /></div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1"><label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">เทอม</label><input name="term" required placeholder="1" defaultValue={editingItem?.term || ''} className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all" /></div>
                    <div className="flex-1 space-y-1"><label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ปีการศึกษา</label><input name="year" required placeholder="2567" defaultValue={editingItem?.year || ''} className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all" /></div>
                  </div>
                </>
              )}
              {modalType.includes('Sec') && (
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ชื่อกลุ่มเรียน</label><input name="name" required placeholder="เช้า (A1)" defaultValue={editingItem?.name || ''} className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all" /></div>
              )}
              {(modalType === 'addSession' || modalType === 'editSession') && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ชื่อคาบเรียน</label><input name="title" required placeholder="คาบที่ 1: บทนำ" defaultValue={editingItem?.title || ''} className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">วันที่</label><input name="date" required type="date" defaultValue={editingItem?.date || ''} className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all" /></div>
                </>
              )}
              {modalType.includes('Student') && (
                <>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">รหัสนักศึกษา</label><input name="studentId" required placeholder="6501XXXX" defaultValue={editingItem?.id || ''} readOnly={modalType === 'editStudent'} className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">ชื่อ-นามสกุล</label><input name="name" required placeholder="สมชาย ใจดี" defaultValue={editingItem?.name || ''} className="w-full px-6 py-4 bg-slate-50 rounded-[24px] outline-none border-2 border-transparent focus:border-indigo-100 transition-all" /></div>
                </>
              )}
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingItem(null); }} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs hover:bg-slate-50 rounded-[20px] transition-all">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-[20px] font-black shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all uppercase tracking-widest text-xs">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {dialog.open && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full rounded-[40px] p-8 shadow-2xl border border-white/20">
            <h3 className="text-xl font-black text-slate-900 mb-3">{dialog.title}</h3>
            <p className="text-slate-600 font-medium mb-8">{dialog.message}</p>
            <div className="flex gap-3 justify-end">
              {dialog.type === 'confirm' && (
                <button onClick={() => setDialog({ ...dialog, open: false })} className="px-5 py-3 rounded-2xl text-slate-500 font-bold hover:bg-slate-50">ยกเลิก</button>
              )}
              <button onClick={() => { setDialog({ ...dialog, open: false }); if (dialog.type === 'confirm' && confirmActionRef.current) confirmActionRef.current(); }} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black shadow-lg hover:bg-indigo-700">
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;