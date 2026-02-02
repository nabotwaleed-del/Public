
import { UserRole, QuestionType } from '../types';

export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: { id: 'admin-id', email: 'admin@gov.sa' } }, error: null }),
    signIn: async () => ({ data: { user: {} }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({ single: () => Promise.resolve({ data: {}, error: null }) }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    insert: (data: any) => Promise.resolve({ data, error: null }),
    update: (data: any) => ({ eq: () => Promise.resolve({ data, error: null }) }),
  }),
};

export const MOCK_USER = {
  id: 'user-1',
  full_name: 'أحمد القحطاني',
  role: UserRole.ADMIN,
  center_id: 'center-1'
};

export const MOCK_CENTERS = [
  { id: 'center-1', name: 'مركز الرياض الرئيسي', location: 'الرياض - حي الملز' },
  { id: 'center-2', name: 'فرع جدة النموذجي', location: 'جدة - شارع التحلية' },
  { id: 'center-3', name: 'مركز الدمام لخدمة العملاء', location: 'الدمام - الواجهة البحرية' },
];

export const MOCK_FORMS = [
  { id: 'form-1', title: 'تقييم الزيارة الميدانية (200 درجة)', type: 'center_visit' },
  { id: 'form-2', title: 'تقييم أداء الموظف السنوي', type: 'manager_eval' },
  { id: 'form-3', title: 'التقييم الذاتي للموظف', type: 'employee_self' },
];

// مساعد لإضافة الأسئلة النصية لكل تصنيف
const addTextQuestions = (questions: any[], formId: string) => {
  const categories = Array.from(new Set(questions.map(q => q.category)));
  const result = [...questions];
  
  categories.forEach((cat, index) => {
    result.push({
      id: `t-feedback-${formId}-${index}`,
      form_id: formId,
      category: cat,
      text: 'ملاحظات عامة إضافية حول هذا القسم',
      type: QuestionType.TEXT,
      max_score: 0,
      placeholder: 'اكتب انطباعك العام أو ملاحظات لم تغطها المعايير أعلاه...'
    });
    result.push({
      id: `t-suggest-${formId}-${index}`,
      form_id: formId,
      category: cat,
      text: 'مقترحات للتحسين والتطوير لهذا القسم',
      type: QuestionType.TEXT,
      max_score: 0,
      placeholder: 'بناءً على مشاهداتك، ما الذي يمكن فعله لتحسين الأداء هنا؟'
    });
  });
  
  return result;
};

// بنود الزيارة الميدانية الـ 23 بنداً الأساسية
const BASE_VISIT_QUESTIONS = [
  { id: 'v1', form_id: 'form-1', category: '1- المحيط الخارجي واللوحات', text: 'نظافة الواجهة الزجاجية والمدخل الرئيسي', type: QuestionType.SCALE, max_score: 10, mechanism: 'ممتازة (10) / متوسطة (5) / سيئة (0)' },
  { id: 'v2', form_id: 'form-1', category: '1- المحيط الخارجي واللوحات', text: 'سلامة اللوحة الخارجية والإضاءة الخاصة بها', type: QuestionType.SCALE, max_score: 10, mechanism: 'تعمل بالكامل (10) / عطل جزئي (5) / تالفة (0)' },
  { id: 'v3', form_id: 'form-1', category: '1- المحيط الخارجي واللوحات', text: 'خلو المدخل من الملصقات غير الرسمية أو العشوائية', type: QuestionType.BOOLEAN, max_score: 10, mechanism: 'خالي (10) / يوجد ملصقات (0)' },
  { id: 'v4', form_id: 'form-1', category: '2- صالة الانتظار والخدمة', text: 'نظافة الأرضيات والمكاتب والأسقف من الداخل', type: QuestionType.SCALE, max_score: 10, mechanism: 'ممتازة (10) / متوسطة (5) / سيئة (0)' },
  { id: 'v5', form_id: 'form-1', category: '2- صالة الانتظار والخدمة', text: 'سلامة وجودة الكراسي في منطقة الانتظار', type: QuestionType.SCALE, max_score: 8, mechanism: 'سليمة (8) / عطل بسيط (4) / متهالكة (0)' },
  { id: 'v6', form_id: 'form-1', category: '2- صالة الانتظار والخدمة', text: 'عمل جهاز الترقيم (Q-System) بشكل صحيح', type: QuestionType.BOOLEAN, max_score: 10, mechanism: 'يعمل (10) / عاطل (0)' },
  { id: 'v7', form_id: 'form-1', category: '2- صالة الانتظار والخدمة', text: 'مناسبة درجة حرارة التكييف والتهوية', type: QuestionType.SCALE, max_score: 7, mechanism: 'مناسبة (7) / ضعيفة (3) / سيئة (0)' },
  { id: 'v8', form_id: 'form-1', category: '2- صالة الانتظار والخدمة', text: 'توفر وصلاحية طفايات الحريق وخراطيم المياه', type: QuestionType.BOOLEAN, max_score: 10, mechanism: 'متوفرة وسارية (10) / غير متوفرة أو منتهية (0)' },
  { id: 'v9', form_id: 'form-1', category: '3- الموظفين والانضباط', text: 'الالتزام الكامل بالزي الرسمي (اليونيفورم)', type: QuestionType.SCALE, max_score: 12, mechanism: 'خصم (3) درجات عن كل موظف مخالف' },
  { id: 'v10', form_id: 'form-1', category: '3- الموظفين والانضباط', text: 'وضع بطاقة التعريف (ID Card) لجميع الموظفين', type: QuestionType.SCALE, max_score: 8, mechanism: 'خصم (2) درجة عن كل موظف مخالف' },
  { id: 'v11', form_id: 'form-1', category: '3- الموظفين والانضباط', text: 'تغطية جميع كاونترات الخدمة حسب الخطة', type: QuestionType.SCALE, max_score: 10, mechanism: 'تغطية كاملة (10) / نقص (5) / فراغ كبير (0)' },
  { id: 'v12', form_id: 'form-1', category: '3- الموظفين والانضباط', text: 'منع استخدام الهواتف الشخصية في منطقة الخدمة', type: QuestionType.SCALE, max_score: 10, mechanism: 'التزام كامل (10) / مخالفة واحدة (5) / أكثر (0)' },
  { id: 'v13', form_id: 'form-1', category: '3- الموظفين والانضباط', text: 'بشاشة الموظفين وسرعة استقبال العملاء', type: QuestionType.SCALE, max_score: 10, mechanism: 'ممتاز (10) / مقبول (5) / سيء (0)' },
  { id: 'v14', form_id: 'form-1', category: '4- العمليات والحوكمة', text: 'توقيع العميل على إقرار وصلة بدون عداد', type: QuestionType.BOOLEAN, max_score: 12, mechanism: 'التزام تام (12) / أي مخالفة (0)' },
  { id: 'v15', form_id: 'form-1', category: '4- العمليات والحوكمة', text: 'مطابقة هويات العملاء مع المستندات المقدمة', type: QuestionType.BOOLEAN, max_score: 10, mechanism: 'التزام تام (10) / خطأ واحد (0)' },
  { id: 'v16', form_id: 'form-1', category: '4- العمليات والحوكمة', text: 'دقة إدخال بيانات العملاء في نظام CRM', type: QuestionType.SCALE, max_score: 10, mechanism: 'بدون أخطاء (10) / خطأ بسيط (5)' },
  { id: 'v17', form_id: 'form-1', category: '4- العمليات والحوكمة', text: 'أرشفة المستندات الورقية في ملفات مخصصة', type: QuestionType.BOOLEAN, max_score: 8, mechanism: 'مرتبة (8) / عشوائية (0)' },
  { id: 'v18', form_id: 'form-1', category: '4- العمليات والحوكمة', text: 'الالتزام بوقت إنهاء المعاملة (SLA)', type: QuestionType.SCALE, max_score: 15, mechanism: 'ضمن الوقت (15) / تأخير (7) / متأخر جداً (0)' },
  { id: 'v19', form_id: 'form-1', category: '5- المرافق والخدمات', text: 'نظافة دورات المياه (رجال/نساء)', type: QuestionType.SCALE, max_score: 5, mechanism: 'نظيفة (5) / متوسطة (2) / سيئة (0)' },
  { id: 'v20', form_id: 'form-1', category: '5- المرافق والخدمات', text: 'توفر المعقمات والمستلزمات الصحية', type: QuestionType.BOOLEAN, max_score: 4, mechanism: 'متوفرة (4) / غير متوفرة (0)' },
  { id: 'v21', form_id: 'form-1', category: '5- المرافق والخدمات', text: 'توفر برادات مياه صالحة للشرب', type: QuestionType.BOOLEAN, max_score: 4, mechanism: 'متوفرة وتعمل (4) / غير متوفرة (0)' },
  { id: 'v22', form_id: 'form-1', category: '5- المرافق والخدمات', text: 'جاهزية غرفة الصلاة (نظافة وترتيب)', type: QuestionType.SCALE, max_score: 4, mechanism: 'جاهزة (4) / تحتاج تحسين (2)' },
  { id: 'v23', form_id: 'form-1', category: '5- المرافق والخدمات', text: 'سهولة وصول ذوي الاحتياجات الخاصة (منحدرات)', type: QuestionType.BOOLEAN, max_score: 3, mechanism: 'موجود (3) / غير موجود (0)' },
];

// بنود التقييم الذاتي الأساسية
const BASE_SELF_QUESTIONS = [
  { id: 's1', form_id: 'form-3', category: '1- تقييم المدير المباشر', text: 'يظهر المدير قدوة مهنية في السلوك والأخلاق', type: QuestionType.SCALE, max_score: 5 },
  { id: 's2', form_id: 'form-3', category: '1- تقييم المدير المباشر', text: 'يتخذ المدير قرارات واضحة وفي وقت مناسب', type: QuestionType.SCALE, max_score: 5 },
  { id: 's3', form_id: 'form-3', category: '1- تقييم المدير المباشر', text: 'يحترم المدير آراء الموظفين ويستمع لملاحظاتهم', type: QuestionType.SCALE, max_score: 5 },
  { id: 's4', form_id: 'form-3', category: '1- تقييم المدير المباشر', text: 'يشجع المدير على الابتكار والتحسين', type: QuestionType.SCALE, max_score: 5 },
  { id: 's5', form_id: 'form-3', category: '1- تقييم المدير المباشر', text: 'يقدم المدير توجيهات واضحة ومستمرة بخصوص الأهداف والمهام', type: QuestionType.SCALE, max_score: 5 },
  { id: 's6', form_id: 'form-3', category: '1- تقييم المدير المباشر', text: 'يعطي المدير ملاحظات بناءة على الأداء (تقدير/تنبيه)', type: QuestionType.SCALE, max_score: 5 },
  { id: 's7', form_id: 'form-3', category: '1- تقييم المدير المباشر', text: 'إدارة ضغوط العمل/النوبات: المدير يدير الضغوط ويوازن بين الفريق', type: QuestionType.SCALE, max_score: 5 },
  { id: 's8', form_id: 'form-3', category: '1- تقييم المدير المباشر', text: 'يكافئ المدير الأداء الجيد بوضوح وعدالة', type: QuestionType.SCALE, max_score: 5 },
  { id: 's9', form_id: 'form-3', category: '2- تقييم طبيعة العمل والمهام', text: 'وضوح الأدوار والمسؤوليات لديك', type: QuestionType.SCALE, max_score: 5 },
  { id: 's10', form_id: 'form-3', category: '2- تقييم طبيعة العمل والمهام', text: 'مدى التوافق بين المهام والمهارات المتاحة', type: QuestionType.SCALE, max_score: 5 },
  { id: 's11', form_id: 'form-3', category: '2- تقييم طبيعة العمل والمهام', text: 'عبء العمل وتوزيعه بين الفريق (عادل/غير عادل)', type: QuestionType.SCALE, max_score: 5 },
  { id: 's12', form_id: 'form-3', category: '2- تقييم طبيعة العمل والمهام', text: 'وجود أدوات وأنظمة دعم للعمل (CRM، سكريبتات، إلخ)', type: QuestionType.SCALE, max_score: 5 },
  { id: 's13', form_id: 'form-3', category: '2- تقييم طبيعة العمل والمهام', text: 'جودة ووضوح السكربتات وتعليمات التعامل مع العملاء', type: QuestionType.SCALE, max_score: 5 },
  { id: 's14', form_id: 'form-3', category: '2- تقييم طبيعة العمل والمهام', text: 'المرونة في أداء المهام (الشكاوى والحالات الاستثنائية)', type: QuestionType.SCALE, max_score: 5 },
  { id: 's15', form_id: 'form-3', category: '3- تقييم بيئة العمل والمكان', text: 'كفاية المساحة وسهولة الحركة داخل الموقع', type: QuestionType.SCALE, max_score: 5 },
  { id: 's16', form_id: 'form-3', category: '3- تقييم بيئة العمل والمكان', text: 'الظروف الصحية والسلامة (تهوية، نظافة، إضاءة)', type: QuestionType.SCALE, max_score: 5 },
  { id: 's17', form_id: 'form-3', category: '3- تقييم بيئة العمل والمكان', text: 'جودة وكفاءة الأجهزة والمعدات (سماعات، حواسب، إنترنت)', type: QuestionType.SCALE, max_score: 5 },
  { id: 's18', form_id: 'form-3', category: '3- تقييم بيئة العمل والمكان', text: 'توفر مرافق راحة (استراحة، مياه، دورات مياه نظيفة)', type: QuestionType.SCALE, max_score: 5 },
  { id: 's19', form_id: 'form-3', category: '3- تقييم بيئة العمل والمكان', text: 'توفر إجراءات سلامة طوارئ واضحة', type: QuestionType.SCALE, max_score: 5 },
  { id: 's20', form_id: 'form-3', category: '4- تدريب وتطوير الأداء', text: 'هل تلقيت تدريبات كافية لعملك خلال السنة الماضية؟', type: QuestionType.BOOLEAN, max_score: 5 },
  { id: 's21', form_id: 'form-3', category: '4- تدريب وتطوير الأداء', text: 'إن تلقيت تدريبات - قيم جودتها وملائمتها', type: QuestionType.SCALE, max_score: 5 },
  { id: 's22', form_id: 'form-3', category: '5- الرضا الوظيفي والروح المعنوية', text: 'مدى رضاك العام عن العمل في المركز', type: QuestionType.SCALE, max_score: 5 },
  { id: 's23', form_id: 'form-3', category: '5- الرضا الوظيفي والروح المعنوية', text: 'هل تشعر بأن صوتك مسموع داخل المؤسسة؟', type: QuestionType.SCALE, max_score: 5 },
  { id: 's24', form_id: 'form-3', category: '5- الرضا الوظيفي والروح المعنوية', text: 'هل ترى شغفاً داخل الفريق للعمل وتحقيق أهداف الجودة؟', type: QuestionType.SCALE, max_score: 5 },
  { id: 's25', form_id: 'form-3', category: '5- الرضا الوظيفي والروح المعنوية', text: 'التوازن بين العمل والحياة الشخصية', type: QuestionType.SCALE, max_score: 5 },
];

export const MOCK_QUESTIONS_VISIT = addTextQuestions(BASE_VISIT_QUESTIONS, 'form-1');
export const MOCK_QUESTIONS_SELF = addTextQuestions(BASE_SELF_QUESTIONS, 'form-3');
export const MOCK_QUESTIONS = [...MOCK_QUESTIONS_VISIT, ...MOCK_QUESTIONS_SELF];
