
import React, { useState, useMemo } from 'react';
import { 
  MOCK_CENTERS, 
  MOCK_FORMS,
  MOCK_QUESTIONS_VISIT
} from '../lib/supabase';
import { 
  Search, 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Activity,
  FileSpreadsheet,
  BookOpen,
  ChevronDown,
  Scale,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldCheck,
  Save,
  AlertTriangle,
  ClipboardCheck
} from 'lucide-react';
import { QuestionType } from '../types';

const Visits: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [activeCenterId, setActiveCenterId] = useState<string | null>(null);
  const [evaluationAnswers, setEvaluationAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get selected center details
  const activeCenter = useMemo(() => 
    MOCK_CENTERS.find(c => c.id === activeCenterId), 
    [activeCenterId]
  );

  // Group questions by category for the form
  const groupedQuestions = useMemo(() => {
    return MOCK_QUESTIONS_VISIT.reduce((acc: any, q: any) => {
      const cat = q.category || 'عام';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(q);
      return acc;
    }, {});
  }, []);

  const handleStartEvaluation = (centerId: string) => {
    setActiveCenterId(centerId);
    setEvaluationAnswers({});
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScoreChange = (questionId: string, value: any) => {
    setEvaluationAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateCurrentScore = () => {
    return MOCK_QUESTIONS_VISIT.reduce((sum, q) => {
      const answer = evaluationAnswers[q.id];
      if (answer === undefined) return sum;
      
      if (q.type === QuestionType.BOOLEAN) {
        return sum + (answer ? q.max_score : 0);
      }
      if (q.type === QuestionType.SCALE) {
        // Assuming scale is 1-10 or custom, for mock we map 0-10 based on button selection
        return sum + answer;
      }
      return sum;
    }, 0);
  };

  const handleSubmitEvaluation = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportCSV = () => {
    const visitHistory = [
      { center: 'مركز الرياض الرئيسي', date: '2024-05-12', inspector: 'محمد العتيبي', score: '94%' },
      { center: 'فرع جدة النموذجي', date: '2024-05-10', inspector: 'علي الغامدي', score: '88%' },
    ];
    const headers = ['اسم المركز', 'تاريخ الزيارة', 'المفتش', 'الدرجة'];
    const csvContent = [headers.join(','), ...visitHistory.map(v => [v.center, v.date, v.inspector, v.score].join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `visit_reports_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 1. Success Screen After Submission
  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-3xl border border-emerald-100 shadow-2xl text-center max-w-lg">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">تم اعتماد التقييم</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            تم بنجاح حفظ نتائج الزيارة الميدانية لـ <span className="font-bold text-slate-800">{activeCenter?.name}</span>. تم تحديث سجلات الحوكمة وإرسال التقارير للإدارة المعنية.
          </p>
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-8">
            <span className="text-xs font-bold text-emerald-600 block mb-1">الدرجة النهائية</span>
            <span className="text-4xl font-black text-emerald-700">{calculateCurrentScore()} / 200</span>
          </div>
          <button 
            onClick={() => { setActiveCenterId(null); setIsSubmitted(false); }}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            العودة لقائمة المراكز
          </button>
        </div>
      </div>
    );
  }

  // 2. Active Evaluation Form
  if (activeCenterId) {
    const currentScore = calculateCurrentScore();
    const totalQuestions = MOCK_QUESTIONS_VISIT.length;
    const answeredCount = Object.keys(evaluationAnswers).length;

    return (
      <div className="space-y-6 animate-in slide-in-from-left-4 duration-500 pb-24">
        {/* Sticky Header for Evaluation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md sticky top-20 z-20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveCenterId(null)}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
            >
              <ArrowRight size={24} />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                تفتيش: {activeCenter?.name}
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded border border-amber-100 uppercase">جاري التقييم</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">نموذج الزيارة الميدانية الموحد - الإصدار 2.1</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-black text-slate-400 block uppercase">إجمالي النقاط المحققة</span>
              <span className="text-2xl font-black text-emerald-600">{currentScore} <span className="text-slate-300 text-sm font-bold">/ 200</span></span>
            </div>
            <button 
              onClick={handleSubmitEvaluation}
              disabled={answeredCount < totalQuestions * 0.5} // Allow partial for testing, usually totalQuestions
              className={`px-8 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
                answeredCount >= totalQuestions * 0.5 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-700' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save size={18} />
              اعتماد التقرير
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-slate-900 p-4 rounded-2xl text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="text-emerald-400" size={20} />
            <span className="text-sm font-bold">تقدم التغطية المعيارية:</span>
          </div>
          <div className="flex-1 mx-8 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-black text-emerald-400">{answeredCount} من {totalQuestions} بند</span>
        </div>

        {/* Form Body */}
        <div className="space-y-12">
          {Object.entries(groupedQuestions).map(([category, items]: [string, any]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                  {category}
                </span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {items.map((q: any) => (
                  <div key={q.id} className={`p-6 bg-white rounded-2xl border transition-all ${evaluationAnswers[q.id] !== undefined ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'}`}>
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">معيار قياس</span>
                          {q.type === QuestionType.TEXT && <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 text-[9px] font-bold rounded">وصفي</span>}
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 leading-relaxed">{q.text}</h4>
                        {q.mechanism && (
                          <div className="flex items-start gap-1.5 text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <Info size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                            <p><span className="font-black text-slate-500">الآلية:</span> {q.mechanism}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {q.type === QuestionType.BOOLEAN && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleScoreChange(q.id, true)}
                              className={`px-6 py-2 rounded-xl text-xs font-black border transition-all ${evaluationAnswers[q.id] === true ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}
                            >
                              مطابق
                            </button>
                            <button 
                              onClick={() => handleScoreChange(q.id, false)}
                              className={`px-6 py-2 rounded-xl text-xs font-black border transition-all ${evaluationAnswers[q.id] === false ? 'bg-rose-600 border-rose-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}
                            >
                              غير مطابق
                            </button>
                          </div>
                        )}

                        {q.type === QuestionType.SCALE && (
                          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                            {[0, 5, 10].map((val) => {
                               // For scales like (8 points), we map proportionately or just use simple mock values
                               const actualVal = Math.min(val, q.max_score);
                               return (
                                <button 
                                  key={val}
                                  onClick={() => handleScoreChange(q.id, actualVal)}
                                  className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${evaluationAnswers[q.id] === actualVal ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                  {val === 10 ? 'ممتاز' : val === 5 ? 'متوسط' : 'سيء'}
                                </button>
                               );
                            })}
                          </div>
                        )}

                        {q.type === QuestionType.TEXT && (
                          <textarea 
                            className="w-full lg:w-64 bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none min-h-[60px]"
                            placeholder={q.placeholder}
                            onChange={(e) => handleScoreChange(q.id, e.target.value)}
                          />
                        )}

                        <div className="w-16 text-center border-r border-slate-100 pr-4">
                          <span className="text-[10px] font-black text-slate-300 block uppercase">الوزن</span>
                          <span className="text-sm font-black text-slate-400">{q.max_score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Default Listing Page
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">متابعة الزيارات الميدانية</h2>
          <p className="text-slate-500">مراقبة الالتزام بجدول الزيارات الشهري للمراكز (2 زيارة/شهر)</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm shadow-sm border ${
              showGuide ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={18} />
            دليل معايير التقييم
          </button>
          
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm shadow-sm"
          >
            <FileSpreadsheet size={18} className="text-emerald-600" />
            تصدير CSV
          </button>
        </div>
      </div>

      {/* Evaluation Guide Section */}
      {showGuide && (
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-8 shadow-xl shadow-emerald-900/5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                <Scale size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">دليل وآليات احتساب الدرجات</h3>
                <p className="text-sm text-slate-500">مراجعة البنود والقواعد الحاكمة لعملية التفتيش</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(groupedQuestions).map(([category, items]: [string, any]) => (
              <div key={category} className="space-y-4">
                <h4 className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 inline-block">
                  {category}
                </h4>
                <div className="space-y-2">
                  {items.map((q: any) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{q.text}</p>
                        <span className="text-[10px] font-black text-emerald-600 bg-white px-2 py-1 rounded border border-emerald-50 shrink-0">
                          {q.max_score} درجة
                        </span>
                      </div>
                      {q.mechanism && (
                        <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-start gap-2">
                          <Info size={12} className="text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-400 font-medium italic">
                            <span className="font-bold text-slate-500 not-italic">الآلية:</span> {q.mechanism}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CENTERS.map((center) => (
          <div 
            key={center.id} 
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">نشط</span>
                  <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase">زيارة 1/2</span>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-slate-800 mb-1">{center.name}</h4>
              <p className="text-xs text-slate-400 flex items-center mb-6">
                <MapPin size={12} className="ml-1" />
                {center.location}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">آخر تقييم:</span>
                  <span className="text-sm font-bold text-emerald-600">92%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <button 
                onClick={() => handleStartEvaluation(center.id)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Activity size={18} />
                بدء تقييم جديد
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visits;
