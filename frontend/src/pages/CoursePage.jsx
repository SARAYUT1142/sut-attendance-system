import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Plus, ArrowLeft, Edit, ChevronRight } from 'lucide-react';
import { createApiClient } from '../services/api';
import ItemModal from '../components/ItemModal';
import ConfirmDialog from '../components/ConfirmDialog';

const CoursePage = ({ token }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [dialog, setDialog] = useState({ open: false, type: 'alert', title: '', message: '' });

  const request = useMemo(() => createApiClient(token), [token]);

  useEffect(() => {
    let active = true;
    if (courseId) {
      request('/courses').then((data) => {
        if (!active) return;
        const found = (data || []).find((item) => String(item.id) === String(courseId));
        setCourse(found || null);
      });
      request(`/courses/${courseId}/sections`).then((data) => { if (active) setSections(data || []); });
    }
    return () => { active = false; };
  }, [courseId, request]);

  const showAlert = (message, title = 'แจ้งเตือน') => {
    setDialog({ open: true, type: 'alert', title, message });
  };

  const openAddSection = () => {
    setModalType('addSec');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditSection = (section) => {
    setModalType('editSec');
    setEditingItem(section);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd);
    try {
      if (modalType === 'addSec') {
        await request('/sections', { method: 'POST', body: JSON.stringify({ ...body, course_id: courseId }) });
      } else if (modalType === 'editSec') {
        await request(`/sections/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(body) });
      }
      const data = await request(`/courses/${courseId}/sections`);
      setSections(data || []);
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      showAlert(err.message, 'เกิดข้อผิดพลาด');
    }
  };

  const getModalTitle = () => {
    const action = editingItem ? 'แก้ไข' : 'เพิ่ม';
    return `${action} กลุ่มเรียน`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-8 py-5 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">{course?.name}</h1>
      </div>
      <main className="max-w-4xl mx-auto p-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">จัดการกลุ่มเรียน</h2>
          <button onClick={openAddSection} className="bg-indigo-600 text-white px-6 py-3.5 rounded-[20px] font-black shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-slate-900 active:scale-95 transition-all"><Plus size={18} /> เพิ่มกลุ่มเรียน</button>
        </div>
        <div className="grid gap-6">
          {sections.map((sec) => (
            <div key={sec.id} onClick={() => navigate(`/courses/${courseId}/sections/${sec.id}`)} className="bg-white p-8 rounded-[40px] flex justify-between items-center group hover:shadow-2xl border border-slate-100 cursor-pointer transition-all hover:-translate-x-1 relative">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner"><Users size={32} /></div>
                <div>
                  <h3 className="font-black text-slate-800 text-2xl tracking-tight">{sec.name}</h3>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">แผงควบคุม</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); openEditSection(sec); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                  <Edit size={16} />
                </button>
                <ChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
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
        onConfirm={() => setDialog({ ...dialog, open: false })}
      />
    </div>
  );
};

export default CoursePage;
