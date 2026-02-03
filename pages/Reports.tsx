
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
  Scale,
  Download
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
      ? centerRankings.map((r, idx) => ({ '#': idx + 1, 'المركز': r.name, 'الدرجة': `${r.score}%`, 'الحالة': r.status }))
      : managerReports.map((m, idx) => ({ '#': idx + 1, 'الاسم': m.name, 'الالتزام': `${m.compliance}%`, 'القسم': m.department }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'التقرير التحليلي');
    XLSX.writeFile(workbook, `report_${activeView}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    const title = activeView === 'centers' ? 'Performance Report - Service Centers' : 'Performance Report - Managers';
    doc.setFontSize(20);
    doc.text(title, 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString('ar-SA')}`, 105, 22, { align: 'center' });

    const headers = activeView === 'centers' 
      ? [['Rank', 'Center Name', 'Score (%)', 'Status']]
      : [['Rank', 'Manager Name', 'Compliance (%)', 'Department']];

    const data = activeView === 'centers'
      ? centerRankings.map((r, idx) => [idx + 1, r.name, `${r.score}%`, r.status === 'excelent' ? 'Excellent' : 'Stable'])
      : managerReports.map((m, idx) => [idx + 1, m.name, `${m.compliance}%`, m.department]);

    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    doc.save(`report_${activeView}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500/20"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-800">التقارير التحليلية والذكاء المؤسسي</h2>
            <p className="text-slate-500 font-medium">عرض وتحليل نتائج التقييم الشامل واستخراج الوثائق الرسمية للمراكز والمديرين.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={exportToExcel} 
              className="flex items-center px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-emerald-200 transition-all font-black text-sm shadow-sm group"
            >
              <FileSpreadsheet size={20} className="ml-2 text-emerald-600 group-hover:scale-110 transition-transform" />
              تصدير Excel
            </button>
            <button 
              onClick={exportToPDF} 
              className="flex items-center px-6 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black text-sm shadow-xl shadow-slate-200 group"
            >
              <FilePdf size={20} className="ml-2 text-rose-400 group-hover:scale-110 transition-transform" />
              تصدير PDF (رسمي)
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats and Table Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex p-2 bg-slate-50 border-b border-slate-100">
            <button 
              onClick={() => setActiveView('centers')} 
              className={`flex-1 px-8 py-4 text-sm font-black flex items-center justify-center rounded-2xl transition-all ${activeView === 'centers' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Building2 size={18} className="ml-2" />
              أداء المراكز
            </button>
            <button 
              onClick={() => setActiveView('managers')} 
              className={`flex-1 px-8 py-4 text-sm font-black flex items-center justify-center rounded-2xl transition-all ${activeView === 'managers' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users size={18} className="ml-2" />
              أداء المديرين
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-6">الترتيب</th>
                  <th className="px-8 py-6">{activeView === 'centers' ? 'المركز / الفرع' : 'الاسم والمنصب'}</th>
                  <th className="px-8 py-6">{activeView === 'centers' ? 'متوسط الدرجة' : 'نسبة الالتزام'}</th>
                  <th className="px-8 py-6">المستوى التشغيلي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeView === 'centers' ? centerRankings.map((rank, idx) => (
                  <tr key={rank.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-xs ${idx < 3 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                         {idx + 1}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{rank.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{rank.manager}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{rank.score}%</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                           <div className="h-full bg-emerald-500" style={{ width: `${rank.score}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border shadow-sm ${
                         rank.status === 'excelent' 
                         ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                         : rank.status === 'warning'
                         ? 'bg-rose-50 border-rose-100 text-rose-700'
                         : 'bg-blue-50 border-blue-100 text-blue-700'
                       }`}>
                         {rank.status === 'excelent' ? 'أداء متميز' : rank.status === 'warning' ? 'يحتاج تحسين' : 'أداء مستقر'}
                       </span>
                    </td>
                  </tr>
                )) : managerReports.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-xs ${idx < 3 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                         {idx + 1}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{m.department}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-emerald-600">{m.compliance}%</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center text-emerald-600 gap-2 font-black text-[10px] bg-emerald-50 w-fit px-3 py-1.5 rounded-full border border-emerald-100">
                        <CheckCircle2 size={14}/> 
                        ملتزم بالمعايير
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
             <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2">
               <AlertCircle size={12} className="text-blue-500" />
               البيانات أعلاه محدثة تلقائياً بناءً على آخر الزيارات الميدانية المعتمدة.
             </p>
          </div>
        </div>

        {/* Scoring Methodology Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl shadow-slate-200 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -ml-16 -mt-16"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mb-24"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-lg font-black text-emerald-400 mb-8 flex items-center gap-3">
                <Scale size={24} />
                حوكمة القياس (المسودة 2024)
              </h3>
              
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
                {MOCK_QUESTIONS_VISIT.filter(q => q.mechanism).map((q, idx) => (
                  <div key={q.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-black text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
                        البند {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-black text-white/40 uppercase">المعيار الذهبي</span>
                    </div>
                    <p className="text-xs font-black text-slate-100 mb-4 leading-relaxed">{q.text}</p>
                    <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-white/5">
                      <BookOpen size={16} className="text-emerald-400 shrink-0 mt-0.5 group-hover:rotate-12 transition-transform" />
                      <p className="text-[10px] leading-relaxed text-slate-300 italic font-medium">
                        {q.mechanism}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/10">
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Download size={14} />
                  تحميل دليل الامتثال الكامل
                </button>
                <p className="text-[9px] text-slate-500 text-center font-bold mt-4 opacity-50">
                  جميع الحقوق محفوظة - إدارة الجودة والحوكمة 2024
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
