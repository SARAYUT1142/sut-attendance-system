import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Plus, LogOut, Trash2, Edit } from 'lucide-react';
import { createApiClient } from '../services/api';
import ItemModal from '../components/ItemModal';
import ConfirmDialog from '../components/ConfirmDialog';

const DashboardPage = ({ token, user, onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [dialog, setDialog] = useState({ open: false, type: 'alert', title: '', message: '' });
  const confirmActionRef = useRef(null);

  const request = useMemo(() => createApiClient(token), [token]);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    if (token) {
      request('/courses').then((data) => { if (active) setCourses(data || []); });
    }
    return () => { active = false; };
  }, [token, request]);

  const showAlert = (message, title = 'แจ้งเตือน') => {
    setDialog({ open: true, type: 'alert', title, message });
  };

  const showConfirm = (message, onConfirm, title = 'ยืนยันการทำรายการ') => {
    confirmActionRef.current = onConfirm;
    setDialog({ open: true, type: 'confirm', title, message });
  };

  const openAddCourse = () => {
    setModalType('addCourse');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditCourse = (course) => {
    setModalType('editCourse');
    setEditingItem(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (courseId) => {
    showConfirm('ยืนยันการลบ?', async () => {
      try {
        await request(`/courses/${courseId}`, { method: 'DELETE' });
        const data = await request('/courses');
        setCourses(data || []);
      } catch (err) {
        showAlert(err.message, 'เกิดข้อผิดพลาด');
      }
    });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd);
    try {
      if (modalType === 'addCourse') {
        await request('/courses', { method: 'POST', body: JSON.stringify(body) });
      } else if (modalType === 'editCourse') {
        await request(`/courses/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(body) });
      }
      const data = await request('/courses');
      setCourses(data || []);
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      showAlert(err.message, 'เกิดข้อผิดพลาด');
    }
  };

  const getModalTitle = () => {
    const action = editingItem ? 'แก้ไข' : 'เพิ่ม';
    return `${action} คอร์ส`;
  };

  return (
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
          <button onClick={() => { onLogout(); navigate('/login'); }} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100"><LogOut size={18} /></button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">คอร์สของฉัน</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">จัดการรายวิชาที่สอน</p>
          </div>
          <button onClick={openAddCourse} className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black shadow-2xl shadow-indigo-100 flex items-center gap-2 hover:bg-slate-900 transition-all hover:-translate-y-1">
            <Plus size={20} /> เพิ่มคอร์ส
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} onClick={() => navigate(`/courses/${course.id}`)} className="bg-white p-8 rounded-[48px] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); openEditCourse(course); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm"><Edit size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-white shadow-sm"><Trash2 size={16} /></button>
              </div>
              <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-10 group-hover:scale-110 transition-transform shadow-inner"><BookOpen size={32} /></div>
              <h3 className="text-2xl font-black text-slate-800 mb-1 leading-tight">{course.name}</h3>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[10px] font-black tracking-widest uppercase bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">เทอม {course.term}/{course.year}</span>
                <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full flex items-center gap-1"><Users size={10} /> จัดการ</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ItemModal
        isOpen={isModalOpen}
        modalType={modalType}
        editingItem={editingItem}
        getModalTitle={getModalTitle}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSubmit={handleModalSubmit}
      />

      <ConfirmDialog
        dialog={dialog}
        onClose={() => setDialog({ ...dialog, open: false })}
        onConfirm={() => {
          setDialog({ ...dialog, open: false });
          if (dialog.type === 'confirm' && confirmActionRef.current) confirmActionRef.current();
        }}
      />
    </div>
  );
};

export default DashboardPage;
