
import React, { useState } from 'react';
import { 
  CheckCircle, 
  User, 
  ShieldCheck, 
  Briefcase, 
  Monitor, 
  Heart,
  MessageSquare,
  Send,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const sections = [
  {
    id: 'manager',
    title: '1- تقييم المدير المباشر (القيادة والإدارة)',
    icon: User,
    questions: [
      { id: 's1', text: 'يظهر المدير قدوة مهنية في السلوك والأخلاق', type: 'scale' },
      { id: 's2', text: 'يتخذ المدير قرارات واضحة وفي وقت مناسب', type: 'scale' },
      { id: 's3', text: 'يحترم المدير آراء الموظفين ويستمع لملاحظاتهم', type: 'scale' },
      { id: 's4', text: 'يشجع المدير على الابتكار والتحسين', type: 'scale' },
      { id: 's5', text: 'يقدم المدير توجيهات واضحة ومستمرة بخصوص الأهداف والمهام', type: 'scale' },
      { id: 's6', text: 'يعطي المدير ملاحظات بناءة على الأداء (تقدير/تنبيه)', type: 'scale' },
      { id: 's7', text: 'إدارة ضغوط العمل/النوبات: المدير يدير الضغوط ويوازن بين الفريق', type: 'scale' },
      { id: 's8', text: 'يكافئ المدير الأداء الجيد بوضوح وعدالة', type: 'scale' },
    ],
    textFields: [
      { id: 'positives', label: 'ما أهم نقطتين يجب أن يحافظ عليهما المدير (إيجابيات)؟' },
      { id: 'negatives', label: 'ما أهم نقطتين يجب أن يحسنها المدير (سلبيات)؟' }
    ]
  },
  {
    id: 'tasks',
    title: '2- تقييم طبيعة العمل والمهام',
    icon: Briefcase,
    questions: [
      { id: 's9', text: 'وضوح الأدوار والمسؤوليات لديك', type: 'scale' },
      { id: 's10', text: 'مدى التوافق بين المهام والمهارات المتاحة', type: 'scale' },
      { id: 's11', text: 'عبء العمل وتوزيعه بين الفريق (عادل/غير عادل)', type: 'scale' },
      { id: 's12', text: 'وجود أدوات وأنظمة دعم للعمل (أنظمة CRM، سكريبتات، قواعد معرفة)', type: 'scale' },
      { id: 's13', text: 'جودة ووضوح السكربتات وتعليمات التعامل مع العملاء', type: 'scale' },
      { id: 's14', text: 'المرونة في أداء المهام (قدرة على التعامل مع شكاوى وحالات استثنائية)', type: 'scale' },
    ],
    textFields: [
      { id: 'obstacle', label: 'ما أهم عائق يؤثر على نجاحك في العمل اليومي؟' }
    ]
  },
  {
    id: 'environment',
    title: '3- تقييم بيئة العمل والمكان',
    icon: Monitor,
    questions: [
      { id: 's15', text: 'كفاية المساحة وسهولة الحركة داخل الموقع', type: 'scale' },
      { id: 's16', text: 'الظروف الصحية والسلامة (تهوية، نظافة، إضاءة)', type: 'scale' },
      { id: 's17', text: 'جودة وكفاءة الأجهزة والمعدات (سماعات، حواسب، إنترنت)', type: 'scale' },
      { id: 's18', text: 'توفر مرافق راحة (استراحة، مياه، دورات مياه نظيفة)', type: 'scale' },
      { id: 's19', text: 'توفر إجراءات سلامة طوارئ واضحة', type: 'scale' },
    ],
    textFields: [
      { id: 'env_suggest', label: 'اقتراحات لتحسين بيئة العمل (مكان العمل وأدواته):' }
    ]
  },
  {
    id: 'training',
    title: '4- تدريب وتطوير الأداء',
    icon: ShieldCheck,
    questions: [
      { id: 's20', text: 'هل تلقيت تدريبات كافية لعملك خلال السنة الماضية؟', type: 'boolean' },
      { id: 's21', text: 'إن تلقيت تدريبات - قيم جودتها وملائمتها', type: 'scale' },
    ],
    textFields: [
      { id: 'tr_needed', label: 'ما أنواع التدريب التي تحتاجها لتحسين أدائك؟' }
    ]
  },
  {
    id: 'morale',
    title: '5- الرضا الوظيفي والروح المعنوية',
    icon: Heart,
    questions: [
      { id: 's22', text: 'مدى رضاك العام عن العمل في المركز', type: 'scale' },
      { id: 's23', text: 'هل تشعر بأن صوتك مسموع داخل المؤسسة؟', type: 'scale' },
      { id: 's24', text: 'هل ترى شغفاً داخل الفريق للعمل وتحقيق أهداف الجودة؟', type: 'scale' },
      { id: 's25', text: 'التوازن بين العمل والحياة الشخصية', type: 'scale' },
    ],
    textFields: [
      { id: 'improvement', label: 'ما الذي سيجعل مركز الخدمة أفضل للموظفين؟' }
    ]
  }
];

const EmployeeSelfEval: React.FC = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentSection = sections[currentSectionIndex];

  const handleScaleChange = (id: string, value: number | boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleTextChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const nextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const prevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-emerald-100 shadow-xl p-12 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">تم إرسال تقييمك بنجاح</h2>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
          شكراً لمساهمتك الصادقة. رأيك هو المحرك الأساسي لتحسين بيئة العمل وتطوير الأداء في المركز.
        </p>
        <button 
          onClick={() => {
            setIsSubmitted(false);
            setCurrentSectionIndex(0);
            setAnswers({});
          }}
          className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom-6 duration-700">
      {/* Header Info */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">استبانة رضا الموظفين</h2>
            <p className="text-slate-500 text-sm mt-1">المساهمة في تطوير بيئة العمل والقيادة</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 uppercase">
              <User size={12} className="ml-1.5 text-emerald-500" />
              الرياض الرئيسي
            </span>
            <span className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase">
              <ShieldCheck size={12} className="ml-1.5" />
              سرية تامة
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase">تقدم الإكمال</span>
            <span className="text-[10px] font-black text-emerald-600">{Math.round(((currentSectionIndex + 1) / sections.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Current Section Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
          <div className="p-2.5 bg-white text-emerald-600 rounded-xl shadow-sm border border-slate-100">
            <currentSection.icon size={22} />
          </div>
          <h3 className="font-black text-slate-800 text-lg">{currentSection.title}</h3>
        </div>
        
        <div className="p-8 space-y-12">
          {/* Scale Questions */}
          <div className="space-y-8">
            {currentSection.questions.map((q) => (
              <div key={q.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-50 last:border-0 last:pb-0">
                <p className="text-sm font-bold text-slate-700 leading-relaxed lg:max-w-xl">{q.text}</p>
                
                {q.type === 'scale' ? (
                  <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleScaleChange(q.id, val)}
                        className={`w-12 h-11 rounded-xl text-xs font-black transition-all ${
                          answers[q.id] === val 
                          ? 'bg-emerald-600 text-white shadow-lg scale-105' 
                          : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleScaleChange(q.id, true)}
                      className={`px-8 py-2.5 rounded-xl text-xs font-black border transition-all ${answers[q.id] === true ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200'}`}
                    >
                      نعم
                    </button>
                    <button 
                      onClick={() => handleScaleChange(q.id, false)}
                      className={`px-8 py-2.5 rounded-xl text-xs font-black border transition-all ${answers[q.id] === false ? 'bg-rose-600 border-rose-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-rose-200'}`}
                    >
                      لا
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Text Fields */}
          {currentSection.textFields && (
            <div className="space-y-8 pt-8 border-t border-slate-100">
              {currentSection.textFields.map((field) => (
                <div key={field.id} className="space-y-3">
                  <label className="text-xs font-black text-slate-500 flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-emerald-500" />
                    {field.label}
                  </label>
                  <textarea
                    value={answers[field.id] || ''}
                    onChange={(e) => handleTextChange(field.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none min-h-[120px] transition-all resize-none shadow-inner"
                    placeholder="يرجى كتابة ملاحظاتك هنا بمصداقية..."
                  ></textarea>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200">
        <button 
          onClick={prevSection}
          disabled={currentSectionIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all ${currentSectionIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <ChevronRight size={20} />
          السابق
        </button>

        <div className="flex flex-col items-center gap-1 hidden md:flex">
          <div className="flex gap-1.5">
            {sections.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentSectionIndex ? 'w-6 bg-emerald-500' : 'bg-slate-700'}`}
              ></div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase mt-2">المرحلة {currentSectionIndex + 1} من {sections.length}</span>
        </div>

        <button 
          onClick={nextSection}
          className="flex items-center gap-2 px-10 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black transition-all shadow-lg shadow-emerald-900/40"
        >
          {currentSectionIndex === sections.length - 1 ? 'إرسال التقييم' : 'التالي'}
          {currentSectionIndex === sections.length - 1 ? <Send size={18} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Privacy Notice */}
      <div className="text-center space-y-2 px-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <AlertCircle size={12} className="text-amber-500" />
          تنبيه: صوتك مسموع ومحمي. البيانات تُحلل بشكل مجهول لتحسين جودة العمل فقط.
        </p>
      </div>
    </div>
  );
};

export default EmployeeSelfEval;
