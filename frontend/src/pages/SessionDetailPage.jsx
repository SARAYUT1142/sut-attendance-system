import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, Trash2, ArrowLeft, Square, Play, ChevronRight, Users, Search, Check, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { createApiClient } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

const SessionDetailPage = ({ token }) => {
    const { courseId, sectionId, sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialog, setDialog] = useState({ open: false, type: 'alert', title: '', message: '' });
    const confirmActionRef = useRef(null);

    const checkinUrl = useMemo(() => {
        if (!courseId || !sectionId || !sessionId) return '';

        // url สำหรับให้นักศึกษาเช็คอินผ่าน QR code (ต้องแก้เป็น URL จริงตอน deploy)
        const origin = 'http://192.168.10.63:5173';
        return `${origin}/courses/${courseId}/sections/${sectionId}/sessions/${sessionId}/checkin`;
    }, [courseId, sectionId, sessionId]);


    const request = useMemo(() => createApiClient(token), [token]);

    useEffect(() => {
        let active = true;
        if (sectionId) {
            request(`/sections/${sectionId}/students`).then((data) => { if (active) setStudents(data || []); });
        }
        return () => { active = false; };
    }, [sectionId, request]);

    useEffect(() => {
        let active = true;
        if (sectionId && sessionId) {
            request(`/sections/${sectionId}/sessions`).then((data) => {
                if (!active) return;
                const found = (data || []).find((item) => String(item.id) === String(sessionId));
                setSession(found || null);
            });
            request(`/sessions/${sessionId}/report`).then((data) => { if (active) setAttendances(data || []); });
        }
        return () => { active = false; };
    }, [sectionId, sessionId, request]);

    const showAlert = (message, title = 'แจ้งเตือน') => {
        setDialog({ open: true, type: 'alert', title, message });
    };

    const showConfirm = (message, onConfirm, title = 'ยืนยันการทำรายการ') => {
        confirmActionRef.current = onConfirm;
        setDialog({ open: true, type: 'confirm', title, message });
    };

    const handleExport = () => {
        if (!session) return;
        let csvContent = "\uFEFFรหัส,ชื่อ,สถานะ,เวลา\n";
        students.forEach((std) => {
            const att = attendances.find((a) => a.student_id === std.id);
            csvContent += `${std.id},${std.name},${att ? 'มาเรียน' : 'ขาดเรียน'},${att ? att.check_time : '-'}\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `รายงาน_${session.title}.csv`;
        link.click();
    };

    const handleDeleteSession = () => {
        if (!session?.id) return;
        showConfirm('ยืนยันการลบ?', async () => {
            try {
                await request(`/sessions/${session.id}`, { method: 'DELETE' });
                navigate(`/courses/${courseId}/sections/${sectionId}`);
            } catch (err) {
                showAlert(err.message, 'เกิดข้อผิดพลาด');
            }
        });
    };

    const handleToggleCheckIn = async () => {
        if (!session?.id) return;
        try {
            await request(`/sessions/${session.id}/toggle`, { method: 'PATCH' });
            setSession((prev) => ({ ...prev, is_open: !prev.is_open }));
        } catch (err) {
            showAlert(err.message, 'เกิดข้อผิดพลาด');
        }
    };

    const filteredStudents = students.filter((std) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        const name = String(std.name || '').toLowerCase();
        const id = String(std.id || '').toLowerCase();
        return name.includes(term) || id.includes(term);
    });



    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}`)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"><ArrowLeft size={20} /></button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{session?.title}</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{session?.date}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-900 shadow-xl shadow-emerald-50 transition-all text-xs">
                        <Download size={18} /> ดาวน์โหลดรายงาน
                    </button>
                    <button onClick={handleDeleteSession} className="p-3 text-slate-300 hover:text-red-500 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all"><Trash2 size={20} /></button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto p-8 grid lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-12 flex items-center gap-2 underline underline-offset-8 decoration-indigo-100">คิวอาร์เช็คชื่อสด</h2>
                        <div className={`p-10 bg-slate-50 rounded-[48px] border-4 border-dashed border-slate-100 transition-all duration-700 shadow-inner ${session?.is_open ? 'opacity-100 scale-100' : 'opacity-10 scale-90 grayscale'}`}>
                            <div className="bg-white p-4 rounded-3xl shadow-inner">
                                <QRCodeSVG value={checkinUrl} size={240} bgColor="#ffffff" fgColor="#0f172a" />
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-6">สแกนเพื่อเช็คชื่อ</p>
                        <div className="w-full mt-14 space-y-5">
                            <button
                                onClick={handleToggleCheckIn}
                                className={`w-full py-6 rounded-4xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${session?.is_open ? 'bg-red-50 text-red-600 shadow-red-50 hover:bg-red-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'}`}
                            >
                                {session?.is_open ? <><Square size={22} fill="currentColor" /> ปิดการเช็คชื่อ</> : <><Play size={22} fill="currentColor" /> เปิดการเช็คชื่อ</>}
                            </button>
                            {session?.is_open && (
                                <button onClick={() => navigate(`/courses/${courseId}/sections/${sectionId}/sessions/${sessionId}/checkin`)} className="text-indigo-500 font-bold text-sm tracking-widest uppercase w-full py-4 hover:bg-indigo-50 rounded-2xl transition-colors">
                                    จำลองการสแกนของนักศึกษา <ChevronRight size={14} className="inline ml-1" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="bg-linear-to-br from-indigo-600 to-violet-700 p-10 rounded-[56px] shadow-2xl shadow-indigo-100 flex flex-col gap-8">
                        <div className="flex justify-between items-center text-white">
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">อัตราเข้าชั้นเรียน</p>
                                <p className="text-5xl font-black tracking-tighter">{attendances.length} / {students.length}</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md"><Users size={32} /></div>
                        </div>
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden backdrop-blur-md">
                            <div className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${(attendances.length / (students.length || 1)) * 100}%` }}></div>
                        </div>
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
                    <div className="overflow-y-auto max-h-187.5">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-50">
                                {filteredStudents.map((std) => {
                                    const att = attendances.find((a) => a.student_id === std.id);
                                    return (
                                        <tr key={std.id} className="hover:bg-indigo-50/20 transition-all group">
                                            <td className="px-12 py-8">
                                                <p className="font-black text-slate-800 leading-tight text-xl tracking-tight group-hover:text-indigo-600 transition-colors">{std.name}</p>
                                                <p className="text-[11px] font-mono text-slate-400 mt-2 uppercase tracking-[0.3em] font-bold">{std.id}</p>
                                            </td>
                                            <td className="px-12 py-8 text-center">
                                                {att ? (
                                                    <span className="px-6 py-2.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 w-fit mx-auto shadow-sm border border-emerald-200 scale-100">
                                                        <Check size={14} strokeWidth={4} /> มาเรียน
                                                    </span>
                                                ) : (
                                                    <span className="px-6 py-2.5 bg-slate-100 text-slate-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 w-fit mx-auto border border-slate-200">
                                                        <X size={14} strokeWidth={4} /> ขาดเรียน
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-12 py-8 text-right font-mono text-xs text-slate-400 italic">
                                                {att ? new Date(att.check_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
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

export default SessionDetailPage;
