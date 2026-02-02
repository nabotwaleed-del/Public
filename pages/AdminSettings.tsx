
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save,
  FileText,
  AlertCircle,
  GripVertical,
  ChevronRight,
  FolderOpen,
  Info,
  Type as TypeIcon,
  Settings2,
  MessageSquareText,
  Hash,
  MessageSquareQuote
} from 'lucide-react';
import { MOCK_FORMS, MOCK_QUESTIONS_VISIT, MOCK_QUESTIONS_SELF } from '../lib/supabase';
import { QuestionType } from '../types';

const AdminSettings: React.FC = () => {
  const [activeFormId, setActiveFormId] = useState(MOCK_FORMS[0].id);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get current form data
  const currentForm = useMemo(() => 
    MOCK_FORMS.find(f => f.id === activeFormId), 
    [activeFormId]
  );

  // Switch questions based on active form
  const questions = useMemo(() => {
    if (activeFormId === 'form-1') return MOCK_QUESTIONS_VISIT;
    if (activeFormId === 'form-3') return MOCK_QUESTIONS_SELF;
    return [];
  }, [activeFormId]);

  const totalScore = questions.reduce((sum, q) => sum + (q.max_score || 0), 0);

  // Group questions by category for better display
  const groupedQuestions = useMemo(() => {
    const groups: Record<string, any[]> = {};
    questions.forEach(q => {
      const cat = (q as any).category || 'أساسي';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(q);
    });
    return groups;
  }, [questions]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
      {/* Sidebar - Forms List */}
      <div className="xl:col-span-1 space-y-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen size={18} className="text-emerald-500" />
            نماذج التقييم
          </h3>
          <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {MOCK_FORMS.map((form) => (
            <button
              key={form.id}
              onClick={() => setActiveFormId(form.id)}
              className={`w-full flex items-center p-4 rounded-xl border transition-all text-right group ${
                activeFormId === form.id 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-slate-50'
              }`}
            >
              <FileText size={18} className={`ml-3 ${activeFormId === form.id ? 'text-emerald-100' : 'text-emerald-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-bold leading-none">{form.title}</p>
                <p className={`text-[10px] mt-1.5 font-medium ${activeFormId === form.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {form.type === 'center_visit' ? 'نموذج زيارة ميدانية' : 
                   form.type === 'employee_self' ? 'استقصاء موظفين' : 'تقييم داخلي'}
                </p>
              </div>
              <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeFormId === form.id ? 'text-white' : 'text-slate-300'}`} />
            </button>
          ))}
        </div>

        {/* Total Score Summary */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl mt-6 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full"></div>
          <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider relative z-10">إجمالي الدرجات</p>
          <div className="flex items-end gap-2 relative z-10">
            <span className="text-4xl font-black text-emerald-400">{totalScore}</span>
            <span className="text-slate-500 mb-1.5 font-bold text-sm">درجة</span>
          </div>
          <div className="mt-5 pt-5 border-t border-slate-800 relative z-10">
            <div className="flex justify-between text-xs mb-3">
              <span className="text-slate-400 font-medium">عدد البنود المعتمدة</span>
              <span className="font-bold text-emerald-400">{questions.length}</span>
            </div>
            {activeFormId === 'form-1' && totalScore < 200 && (
              <div className="flex items-start gap-2 text-amber-400 text-[10px] font-bold mt-2 bg-amber-500/10 p-2 rounded-lg border border-amber-900/20">
                <AlertCircle size={14} className="shrink-0" />
                تنبيه حوكمة: الدرجات الحالية ({totalScore}) أقل من المستهدف (200). يرجى موازنة الأوزان.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Panel - Question Builder */}
      <div className="xl:col-span-3 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-slate-800">{currentForm?.title}</h2>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">مفعل</span>
              </div>
              <p className="text-sm text-slate-500">مراجعة المعايير، الأوزان، وآليات احتساب الدرجات للنموذج</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg text-sm">
                <Save size={18} className="ml-2" />
                حفظ التغييرات
              </button>
            </div>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedQuestions).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 whitespace-nowrap">
                    {category}
                  </span>
                  <div className="h-px w-full bg-slate-100"></div>
                </div>
                
                <div className="space-y-3">
                  {(items as any[]).map((q, idx) => {
                    const isText = q.type === QuestionType.TEXT;
                    return (
                      <div 
                        key={q.id} 
                        className={`group border p-6 rounded-2xl transition-all relative overflow-hidden ${
                          isText 
                          ? 'bg-indigo-50/50 border-indigo-200 border-r-4 border-r-indigo-500 shadow-sm' 
                          : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5'
                        }`}
                      >
                        {isText && (
                          <div className="absolute top-0 right-0 p-1.5 bg-indigo-500 text-white rounded-bl-xl shadow-sm z-10">
                             <MessageSquareQuote size={14} />
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="flex items-center gap-4 w-full md:w-auto mt-1">
                            <div className={`p-2 cursor-move ${isText ? 'text-indigo-400 group-hover:text-indigo-600' : 'text-slate-300 group-hover:text-emerald-400'}`}>
                              <GripVertical size={20} />
                            </div>
                            <span className={`text-lg font-black transition-colors ${isText ? 'text-indigo-300 group-hover:text-indigo-500' : 'text-slate-200 group-hover:text-emerald-100'}`}>{(idx + 1).toString().padStart(2, '0')}</span>
                          </div>

                          <div className="flex-1 w-full space-y-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 text-[9px] font-black rounded uppercase flex items-center gap-1.5 shadow-sm border ${
                                q.type === QuestionType.SCALE ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                                q.type === QuestionType.BOOLEAN ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                                'bg-white border-indigo-200 text-indigo-700'
                              }`}>
                                {isText ? <MessageSquareText size={10} /> : (q.type === QuestionType.SCALE ? <Hash size={10} /> : <FileText size={10} />)}
                                {q.type === QuestionType.SCALE ? 'مقياس رقمي' : 
                                 q.type === QuestionType.BOOLEAN ? 'نعم / لا' : 
                                 'سؤال وصفي (ملاحظات نوعية)'}
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              <label className={`text-[10px] font-black uppercase tracking-wider ${isText ? 'text-indigo-500' : 'text-slate-400'}`}>نص السؤال / البند</label>
                              <input 
                                type="text" 
                                defaultValue={q.text} 
                                className={`w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 outline-none ${isText ? 'text-indigo-900' : 'text-slate-800'}`}
                              />
                            </div>
                            
                            {/* آلية التقييم / تلميح الإدخال */}
                            <div className={`p-4 rounded-xl border ${isText ? 'bg-white/80 border-indigo-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Settings2 size={14} className={isText ? 'text-indigo-500' : 'text-emerald-500'} />
                                <label className={`text-[10px] font-black uppercase ${isText ? 'text-indigo-500' : 'text-slate-500'}`}>
                                  {isText ? 'تلميح الإدخال للمستخدم' : 'آلية احتساب الدرجة (Scoring Mechanism)'}
                                </label>
                              </div>
                              <textarea 
                                defaultValue={q.mechanism || q.placeholder}
                                rows={2}
                                className="w-full bg-transparent border-none p-0 text-[11px] font-medium text-slate-600 focus:ring-0 outline-none resize-none leading-relaxed"
                                placeholder={isText ? "اكتب هنا التلميح الذي يظهر للموظف..." : "اكتب هنا كيف يتم خصم أو إضافة الدرجات لهذا البند..."}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end md:self-center">
                            {!isText ? (
                              <div className="text-center bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm min-w-[70px]">
                                <span className="text-[10px] font-black text-slate-400 block mb-0.5">الدرجة</span>
                                <input 
                                  type="number" 
                                  defaultValue={q.max_score} 
                                  className="w-8 text-center text-lg font-black text-emerald-600 bg-transparent border-none p-0 focus:ring-0 outline-none"
                                />
                              </div>
                            ) : (
                              <div className="text-center bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm min-w-[100px] flex flex-col items-center justify-center">
                                <span className="text-[9px] font-black text-indigo-400 block mb-0.5 italic uppercase tracking-tighter">وصف نوعي</span>
                                <span className="text-[10px] font-black text-indigo-600 flex items-center gap-1">
                                  <AlertCircle size={10} />
                                  لا توجد درجة
                                </span>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button className={`p-2.5 rounded-xl transition-all ${isText ? 'text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100' : 'text-slate-300 hover:text-emerald-600 hover:bg-emerald-50'}`}>
                                <Edit2 size={18} />
                              </button>
                              <button className={`p-2.5 rounded-xl transition-all ${isText ? 'text-indigo-300 hover:text-rose-500 hover:bg-rose-50' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'}`}>
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-5 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all font-bold flex items-center justify-center gap-2 group">
            <Plus size={22} className="group-hover:scale-110 transition-transform" />
            إضافة معيار جديد لهذا النموذج
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
