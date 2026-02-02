
import React, { useState } from 'react';
import { 
  Award, 
  TrendingDown,
  FileSpreadsheet,
  FileText as FilePdf,
  Calendar,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Scale
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MOCK_QUESTIONS_VISIT } from '../lib/supabase';

const centerRankings = [
  { id: 1, name: 'مركز الرياض النموذجي', score: 98.4, manager: 'م. خالد السديري', visits: 2, status: 'excelent' },
  { id: 2, name: 'فرع مكة المركزي', score: 95.2, manager: 'د. عادل العمري', visits: 2, status: 'excelent' },
  { id: 3, name: 'خدمة العملاء - جدة', score: 91.8, manager: 'أ. سارة الحربي', visits: 1, status: 'good' },
  { id: 4, name: 'مركز الدمام الموحد', score: 84.5, manager: 'أ. فهد الزهراني', visits: 2, status: 'good' },
  { id: 5, name: 'فرع بريدة', score: 72.1, manager: 'م. ناصر العتيبي', visits: 1, status: 'warning' },
];

const managerReports = [
  { id: 1, name: 'م. خالد السديري', department: 'منطقة الرياض', compliance: 100, teamSize: 24, avgScore: 94.5 },
  { id: 2, name: 'د. عادل العمري', department: 'منطقة مكة', compliance: 95, teamSize: 18, avgScore: 92.1 },
  { id: 3, name: 'أ. سارة الحربي', department: 'منطقة جدة', compliance: 82, teamSize: 12, avgScore: 88.4 },
  { id: 4, name: 'أ. فهد الزهراني', department: 'المنطقة الشرقية', compliance: 100, teamSize: 30, avgScore: 85.0 },
  { id: 5, name: 'م. ناصر العتيبي', department: 'منطقة القصيم', compliance: 65, teamSize: 15, avgScore: 78.2 },
];

const Reports: React.FC = () => {
  const [activeView, setActiveView] = useState<'centers' | 'managers'>('centers');
  const [dateFilter, setDateFilter] = useState<'month' | 'quarter' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const getDateLabel = () => {
    if (dateFilter === 'month') return 'مايو 2024';
    if (dateFilter === 'quarter') return 'الربع الثاني 2024';
    if (dateFilter === 'year') return 'العام المالي 2024';
    if (dateFilter === 'custom' && startDate && endDate) return `من ${startDate} إلى ${endDate}`;
    return 'فترة مخصصة';
  };

  const exportToExcel = () => {
    const dataToExport = activeView === 'centers' 
      ? centerRankings.map((r, idx) => ({ '#': idx + 1, 'المركز': r.name, 'الدرجة': `${r.score}%` }))
      : managerReports.map((m, idx) => ({ '#': idx + 1, 'الاسم': m.name, 'الالتزام': `${m.compliance}%` }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'التقرير');
    XLSX.writeFile(workbook, `report_${activeView}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(activeView === 'centers' ? 'Center Report' : 'Manager Report', 10, 10);
    doc.save(`report_${activeView}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">التقارير التحليلية</h2>
            <p className="text-slate-500 mt-1">عرض وتحليل نتائج التقييم واستخراج التقارير الرسمية</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportToExcel} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-md">
              <FileSpreadsheet size={18} className="ml-2" />
              تصدير Excel
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats and Table Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button onClick={() => setActiveView('centers')} className={`px-8 py-4 text-sm font-bold flex items-center border-b-2 transition-all ${activeView === 'centers' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}>
              <Building2 size={18} className="ml-2" />
              تقارير المراكز
            </button>
            <button onClick={() => setActiveView('managers')} className={`px-8 py-4 text-sm font-bold flex items-center border-b-2 transition-all ${activeView === 'managers' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}>
              <Users size={18} className="ml-2" />
              تقارير المديرين
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[11px] font-bold uppercase">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">{activeView === 'centers' ? 'المركز' : 'الاسم'}</th>
                  <th className="px-6 py-4">{activeView === 'centers' ? 'الدرجة' : 'الالتزام'}</th>
                  <th className="px-6 py-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeView === 'centers' ? centerRankings.map((rank, idx) => (
                  <tr key={rank.id}>
                    <td className="px-6 py-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{rank.name}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{rank.score}%</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 text-[10px] font-bold rounded ${rank.status === 'excelent' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                         {rank.status === 'excelent' ? 'متميز' : 'مستقر'}
                       </span>
                    </td>
                  </tr>
                )) : managerReports.map((m, idx) => (
                  <tr key={m.id}>
                    <td className="px-6 py-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{m.name}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{m.compliance}%</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-emerald-600 gap-1 font-bold text-[10px]"><CheckCircle2 size={14}/> ملتزم</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scoring Methodology Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl shadow-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -ml-16 -mt-16"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-emerald-400 mb-6 flex items-center gap-2">
                <Scale size={20} />
                مرجع منهجية القياس
              </h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_QUESTIONS_VISIT.filter(q => q.mechanism).map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">البند {idx + 1}</p>
                    <p className="text-xs font-bold text-slate-100 mb-3">{q.text}</p>
                    <div className="flex items-start gap-2 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      <BookOpen size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-relaxed text-emerald-200 italic">
                        {q.mechanism}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] text-slate-400 text-center font-medium">
                  يتم تحديث هذه المنهجية دورياً من قبل إدارة الجودة والحوكمة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
