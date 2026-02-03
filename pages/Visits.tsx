
import React, { useState, useMemo } from 'react';
import { 
  MOCK_CENTERS, 
  MOCK_QUESTIONS_VISIT,
  MOCK_VISIT_RECORDS
} from '../lib/supabase';
import { 
  MapPin, 
  Activity,
  BookOpen,
  Scale,
  Info,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  Building2,
  Users,
  Settings2,
  FileText,
  Archive,
  Star,
  AlertCircle,
  PlusCircle,
  MinusCircle,
  Sparkles,
  BadgeCheck,
  Workflow,
  FileBarChart,
  Server,
  Download,
  // Added missing Calendar icon import
  Calendar
} from 'lucide-react';
import * as XLSX from 'xlsx';

// تقسيم الأسئلة إلى مراحل (Steps) بناءً على التصنيفات
const STEPS = [
  { id: 'cleanliness', title: 'النظافة والمظهر', icon: Sparkles, category: '1- النظافة والمظهر العام' },
  { id: 'discipline', title: 'الانضباط والزي', icon: BadgeCheck, category: '2- الانضباط والمظهر المهني' },
  { id: 'ops', title: 'الأنظمة والعمليات', icon: Workflow, category: '3- جودة العمليات والأنظمة' },
  { id: 'management', title: 'الإدارة والمتابعة', icon: FileBarChart, category: '4- الإدارة والمراجعة الميدانية' },
  { id: 'technical', title: 'الغرف والأرشفة', icon: Server, category: '5- الغرف الفنية والأرشفة' },
];

const Visits: React.FC = () => {
  const [activeCenterId, setActiveCenterId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [evaluationAnswers, setEvaluationAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const activeCenter = useMemo(() => 
    MOCK_CENTERS.find(c => c.id === activeCenterId), 
    [activeCenterId]
  );

  const currentStep = STEPS[currentStepIndex];
  const currentQuestions = useMemo(() => 
    MOCK_QUESTIONS_VISIT.filter(q => q.category === currentStep.category),
    [currentStep]
  );

  const handleStartEvaluation = (centerId: string) => {
    setActiveCenterId(centerId);
    setCurrentStepIndex(0);
    setEvaluationAnswers({});
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScoreChange = (questionId: string, value: number) => {
    setEvaluationAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateTotalScore = () => {
    return Object.values(evaluationAnswers).reduce((sum: number, val: number) => sum + val, 0);
  };

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const exportVisitsToCSV = () => {
    const dataToExport = MOCK_VISIT_RECORDS.map(v => ({
      'اسم المركز': v.center_name,
      'تاريخ الزيارة': v.visit_date,
      'المفتش': v.inspector,
      'الدرجة': v.score
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visit_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. شاشة النجاح والاعتماد النهائي
  if (isSubmitted) {
    const finalScore = calculateTotalScore();
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[40px] border border-blue-100 shadow-2xl text-center max-w-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">اعتماد تقرير الزيارة</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            تم بنجاح أرشفة نتائج التفتيش لـ <span className="font-bold text-slate-800">{activeCenter?.name}</span>. تم تحديث سجل الأداء السنوي للمركز وإخطار الجهات ذات الصلة.
          </p>
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl mb-8">
            <span className="text-xs font-black text-slate-500 block mb-2 uppercase tracking-widest">النتيجة الإجمالية المحققة</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-6xl font-black text-blue-700">{finalScore}</span>
              <span className="text-blue-300 font-bold text-xl">/ 200</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={20} className={(finalScore as number) >= s * 40 ? 'text-blue-500 fill-blue-500' : 'text-slate-200'} />
              ))}
            </div>
          </div>
          <button 
            onClick={() => { setActiveCenterId(null); setIsSubmitted(false); }}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
          >
            العودة للقائمة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // 2. واجهة معالج التقييم (Evaluation Wizard)
  if (activeCenterId) {
    const progress = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-500">
        {/* ملخص الهوية في أعلى الصفحة */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveCenterId(null)} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
                  <ArrowRight size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">تفتيش: {activeCenter?.name}</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
                    <MapPin size={12} className="text-blue-500" />
                    {activeCenter?.location}
                  </p>
                </div>
              </div>
              <div className="bg-blue-700 px-8 py-4 rounded-[24px] text-white shadow-xl shadow-blue-900/20 text-center min-w-[140px]">
                <span className="text-[10px] font-black opacity-70 block mb-0.5 uppercase">إجمالي النقاط</span>
                <span className="text-3xl font-black leading-none">{calculateTotalScore()} <span className="text-xs opacity-50">/ 200</span></span>
              </div>
           </div>

           <div className="mt-8 pt-6 border-t border-slate-50">
             <div className="flex justify-between items-center mb-2 px-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اكتمال مراحل التفتيش</span>
               <span className="text-[10px] font-black text-blue-600">{progress}%</span>
             </div>
             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
             </div>
           </div>
        </div>

        {/* محتوى المرحلة الحالية */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-sm border border-slate-100">
                <currentStep.icon size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">{currentStep.title}</h3>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">{currentStep.category}</p>
              </div>
            </div>
            <span className="text-[11px] font-black text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              {currentQuestions.length} معايير معتمدة
            </span>
          </div>

          <div className="p-10 space-y-16">
            {currentQuestions.map((q, idx) => (
              <div key={q.id} className="space-y-6 pb-12 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-slate-100 text-slate-400 flex items-center justify-center rounded-lg text-[10px] font-black">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">معيار جودة</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800 leading-relaxed">{q.text}</h4>
                    {q.mechanism && (
                      <div className="flex items-start gap-3 text-xs text-slate-600 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-black text-blue-700 text-[10px] uppercase">دليل احتساب الدرجة:</p>
                          <p className="leading-relaxed font-medium">{q.mechanism}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تحديد النتيجة</span>
                    <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                      {/* عرض أزرار الدرجات السريعة */}
                      {[0, Math.round(q.max_score / 2), q.max_score].map((val) => (
                        <button
                          key={val}
                          onClick={() => handleScoreChange(q.id, val)}
                          className={`min-w-[56px] h-12 px-4 rounded-xl text-sm font-black transition-all ${
                            evaluationAnswers[q.id] === val 
                            ? 'bg-blue-600 text-white shadow-xl scale-110' 
                            : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                      
                      {/* مدخل يدوي للخصومات الدقيقة */}
                      <div className="relative flex items-center">
                        <input 
                          type="number"
                          placeholder="خصم"
                          className={`w-20 h-12 text-center text-sm font-black bg-white rounded-xl border-2 outline-none focus:ring-0 transition-all ${
                            evaluationAnswers[q.id] !== undefined && ![0, Math.round(q.max_score / 2), q.max_score].includes(evaluationAnswers[q.id]) 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-slate-100 text-slate-400 focus:border-blue-300'
                          }`}
                          onChange={(e) => handleScoreChange(q.id, Number(e.target.value))}
                        />
                        <span className="absolute -top-6 left-0 right-0 text-[9px] font-black text-slate-300 text-center uppercase">إدخال دقيق</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
                       <Scale size={12} className="text-slate-400" />
                       <span className="text-[10px] font-black text-slate-500 uppercase">الوزن الكلي: {q.max_score}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أدوات التحكم في مراحل التفتيش */}
        <div className="flex items-center justify-between bg-slate-900 p-8 rounded-[32px] shadow-2xl shadow-slate-200">
          <button 
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all ${currentStepIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <ChevronRight size={24} />
            المرحلة السابقة
          </button>

          <div className="hidden md:flex flex-col items-center gap-3">
             <div className="flex gap-2">
               {STEPS.map((_, idx) => (
                 <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-10 bg-blue-500' : 'bg-slate-700'}`}></div>
               ))}
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الخطوة {currentStepIndex + 1} من {STEPS.length}</span>
          </div>

          <button 
            onClick={nextStep}
            className="flex items-center gap-3 px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 active:scale-95"
          >
            {currentStepIndex === STEPS.length - 1 ? 'اعتماد التقرير النهائي' : 'المرحلة التالية'}
            {currentStepIndex === STEPS.length - 1 ? <Send size={20} /> : <ChevronLeft size={24} />}
          </button>
        </div>
      </div>
    );
  }

  // 3. عرض قائمة المراكز الرئيسية
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800">الزيارات الرقابية الميدانية</h2>
          <p className="text-slate-500 mt-1">نظام التفتيش المركزي المعتمد لتقييم معايير الجودة (200 درجة)</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={exportVisitsToCSV}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-black text-sm shadow-sm"
          >
            <Download size={20} className="text-blue-600" />
            تصدير سجل الزيارات (CSV)
          </button>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl transition-all font-black text-sm shadow-sm border-2 ${
              showGuide ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={20} />
            دليل التفتيش والمعايير
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="bg-white border-2 border-blue-100 rounded-[32px] p-10 shadow-2xl animate-in slide-in-from-top-4 duration-300">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-900/10"><Scale size={28} /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">مصفوفة المعايير والأوزان</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">منهجية القياس المعتمدة - 2024</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {STEPS.map(s => (
                <div key={s.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm"><s.icon size={20} /></div>
                      <h4 className="text-base font-black text-slate-700">{s.title}</h4>
                   </div>
                   <div className="space-y-3">
                     {MOCK_QUESTIONS_VISIT.filter(q => q.category === s.category).map(q => (
                       <div key={q.id} className="text-[11px] font-bold text-slate-500 flex justify-between items-start gap-4 border-b border-slate-200/40 pb-2">
                          <span className="leading-tight">{q.text}</span>
                          <span className="text-blue-600 shrink-0 font-black whitespace-nowrap bg-white px-2 py-0.5 rounded-lg border border-blue-50">{q.max_score} د</span>
                       </div>
                     ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {MOCK_CENTERS.map((center) => (
          <div 
            key={center.id} 
            className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group relative animate-in zoom-in duration-300"
          >
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  {activeCenterId === center.id ? <Activity size={32} /> : <Building2 size={32} />}
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="bg-slate-100 border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    زيارة دورية
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase">اخر تحديث: مايو 2024</span>
                </div>
              </div>
              
              <h4 className="text-2xl font-black text-slate-800 mb-2">{center.name}</h4>
              <p className="text-xs text-slate-400 font-bold flex items-center mb-8">
                <MapPin size={14} className="ml-1.5 text-blue-500" />
                {center.location}
              </p>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 mb-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مستوى الالتزام التقديري</span>
                  <span className="text-sm font-black text-blue-600">92%</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
                </div>
              </div>

              <button 
                onClick={() => handleStartEvaluation(center.id)}
                className="w-full py-5 bg-blue-700 hover:bg-slate-900 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 active:scale-95 group-hover:shadow-slate-900/20"
              >
                <Activity size={22} className="animate-pulse" />
                بدء عملية التفتيش
              </button>
            </div>
          </div>
        ))}
        
        {/* بطاقة إضافة مركز جديد */}
        <button className="border-4 border-dashed border-slate-100 rounded-[40px] p-10 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
           <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
              <PlusCircle size={40} />
           </div>
           <span className="text-lg font-black uppercase tracking-widest">إضافة مركز خدمة</span>
        </button>
      </div>

      {/* سجل الزيارات المنجزة */}
      <div className="mt-12 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100"><Archive size={20} /></div>
             <h3 className="text-xl font-black text-slate-800">سجل الزيارات المنجزة (مؤخراً)</h3>
          </div>
          <button 
            onClick={exportVisitsToCSV}
            className="text-blue-600 hover:text-blue-800 text-xs font-black flex items-center gap-1.5"
          >
            <Download size={14} /> تصدير السجل كاملاً
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">اسم المركز</th>
                <th className="px-8 py-5">تاريخ الزيارة</th>
                <th className="px-8 py-5">المفتش المسؤول</th>
                <th className="px-8 py-5">الدرجة المحققة</th>
                <th className="px-8 py-5">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_VISIT_RECORDS.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Building2 size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{record.center_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                      <Calendar size={14} className="text-slate-300" />
                      {record.visit_date}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-300" />
                      {record.inspector}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-black text-blue-700">{record.score}</div>
                      <div className="text-[10px] font-bold text-slate-400">/ 200</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full ${record.score >= 180 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {record.score >= 180 ? 'متميز' : 'مستقر'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Visits;
