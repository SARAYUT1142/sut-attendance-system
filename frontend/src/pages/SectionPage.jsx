import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, UserPlus, FileUp, ArrowLeft, Edit, Trash2, Calendar, Play, QrCode, ChevronRight } from 'lucide-react';
import { createApiClient } from '../services/api';
import ItemModal from '../components/ItemModal';
import ConfirmDialog from '../components/ConfirmDialog';

const SectionPage = ({ token }) => {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [section, setSection] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [dialog, setDialog] = useState({ open: false, type: 'alert', title: '', message: '' });
  const confirmActionRef = useRef(null);

  const request = useMemo(() => createApiClient(token), [token]);

  useEffect(() => {
    let active = true;
    if (courseId) {
      request('/courses').then((data) => {
        if (!active) return;
        const found = (data || []).find((item) => String(item.id) === String(courseId));
        setCourse(found || null);
      });
    }
    return () => { active = false; };
  }, [courseId, request]);

  useEffect(() => {
    let active = true;
    if (courseId && sectionId) {
      request(`/courses/${courseId}/sections`).then((data) => {
        if (!active) return;
        const found = (data || []).find((item) => String(item.id) === String(sectionId));
        setSection(found || null);
      });
      Promise.all([
        request(`/sections/${sectionId}/students`),
        request(`/sections/${sectionId}/sessions`),
      ]).then(([stds, sess]) => {
        if (active) {
          setStudents(stds || []);
          setSessions(sess || []);
        }
      });
    }
    return () => { active = false; };
  }, [courseId, sectionId, request]);

  const showAlert = (message, title = 'แจ้งเตือน') => {
    setDialog({ open: true, type: 'alert', title, message });
  };

  const showConfirm = (message, onConfirm, title = 'ยืนยันการทำรายการ') => {
    confirmActionRef.current = onConfirm;
    setDialog({ open: true, type: 'confirm', title, message });
  };

  const openAddSession = () => {
    setModalType('addSession');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditSession = (session) => {
    setModalType('editSession');
    setEditingItem(session);
    setIsModalOpen(true);
  };

  const openAddStudent = () => {
    setModalType('addStudent');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditStudent = (student) => {
    setModalType('editStudent');
    setEditingItem(student);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd);
    try {
      if (modalType === 'addSession') {
        await request('/sessions', { method: 'POST', body: JSON.stringify({ ...body, section_id: Number(sectionId) }) });
      } else if (modalType === 'editSession') {
        await request(`/sessions/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else if (modalType === 'editStudent') {
        await request(`/sections/${Number(sectionId)}/students/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: body.name }),
        });
      } else if (modalType === 'addStudent') {
        await request(`/sections/${Number(sectionId)}/students`, {
          method: 'POST',
          body: JSON.stringify({ id: body.studentId, name: body.name }),
        });
      }

      const [stds, sess] = await Promise.all([
        request(`/sections/${Number(sectionId)}/students`),
        request(`/sections/${Number(sectionId)}/sessions`),
      ]);
      setStudents(stds || []);
      setSessions(sess || []);
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      showAlert(err.message, 'เกิดข้อผิดพลาด555');
    }
  };

  const handleImportStudents = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      await request(`/sections/${sectionId}/students/import`, { method: 'POST', body: fd, isFormData: true });
      const d = await request(`/sections/${sectionId}/students`);
      setStudents(d || []);
      showAlert('นำเข้าแล้ว');
    } catch (err) {
      showAlert(err.message, 'เกิดข้อผิดพลาด');
    }
  };

  const handleDeleteSession = (sessionId) => {
    showConfirm('ยืนยันการลบ?', async () => {
      try {
        await request(`/sessions/${sessionId}`, { method: 'DELETE' });
        const d = await request(`/sections/${Number(sectionId)}/sessions`);
        setSessions(d || []);
      } catch (err) {
        showAlert(err.message, 'เกิดข้อผิดพลาด');
      }
    });
  };

  const handleDeleteStudent = (studentId) => {
    showConfirm('ยืนยันการลบ?', async () => {
      try {
        await request(`/sections/${Number(sectionId)}/students/${studentId}`, { method: 'DELETE' });
        const d = await request(`/sections/${Number(sectionId)}/students`);
        setStudents(d || []);
      } catch (err) {
        showAlert(err.message, 'เกิดข้อผิดพลาด');
      }
    });
  };

  const modalLabelMap = {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/courses/${courseId}`)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">{section?.name}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course?.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={openAddSession} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"><Calendar size={18} /> เพิ่มคาบเรียน</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8 grid lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4"><Play size={14} className="fill-indigo-500 text-indigo-500" /> คาบเรียนเช็คชื่อ</h3>
          <div className="space-y-5">
            {sessions.map((sess) => (
              <div key={sess.id} onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/sessions/${sess.id}`)} className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl cursor-pointer flex justify-between items-center transition-all group relative">
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
                  <button onClick={(e) => { e.stopPropagation(); openEditSession(sess); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    <Edit size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSession(sess.id); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
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
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Users size={14} /> รายชื่อนักศึกษา</h3>
            <div className="flex gap-2">
              <button onClick={openAddStudent} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><UserPlus size={18} /></button>
              <label className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 cursor-pointer hover:text-indigo-600 shadow-sm transition-all">
                <FileUp size={18} />
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => handleImportStudents(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-100">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr><th className="px-10 py-6">รหัสนักศึกษา</th><th className="px-10 py-6">ชื่อ</th><th className="px-10 py-6 text-right">การทำงาน</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6 font-mono text-xs text-slate-400 tracking-[0.2em] uppercase">{std.id}</td>
                    <td className="px-10 py-6 font-black text-slate-700 text-lg tracking-tight">{std.name}</td>
                    <td className="px-10 py-6 text-right flex justify-end gap-1">
                      <button onClick={() => openEditStudent(std)} className="p-3 text-slate-200 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-white rounded-2xl shadow-sm"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteStudent(std.id)} className="p-3 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-white rounded-2xl shadow-sm"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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

export default SectionPage;
