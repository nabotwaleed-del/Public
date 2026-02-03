
import { createClient } from '@supabase/supabase-js';
import { UserRole, QuestionType, Center, Branch, Profile } from '../types';

/**
 * دالة جلب متغيرات البيئة بشكل آمن للمتصفح.
 * تمنع خطأ "process is not defined"
 */
const getSafeEnv = (key: string): string => {
  try {
    // محاولة الجلب من Vite (في حالة التطوير المحلي)
    const viteEnv = (import.meta as any).env;
    if (viteEnv && viteEnv[`VITE_${key}`]) return viteEnv[`VITE_${key}`];
    if (viteEnv && viteEnv[key]) return viteEnv[key];

    // محاولة الجلب من window (في حالة حقنها من Vercel)
    const win = window as any;
    if (win.ENV && win.ENV[key]) return win.ENV[key];
    
    return '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getSafeEnv('SUPABASE_URL');
const supabaseAnonKey = getSafeEnv('SUPABASE_ANON_KEY');

// علامة التحقق من الاتصال الحي
// نعتبره حياً فقط إذا كان الرابط يبدأ بـ https ولا يحتوي على كلمة placeholder
export const isLive = !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('placeholder'));

/**
 * إنشاء عميل Supabase.
 * نستخدم رابطاً وهمياً صالحاً في حالة عدم وجود الرابط الحقيقي لتجنب انهيار التطبيق.
 */
export const supabase = createClient(
  isLive ? supabaseUrl : 'https://xyz.supabase.co',
  isLive ? supabaseAnonKey : 'dummy-key'
);

// --- البيانات الوهمية (تستخدم فقط كـ Fallback) ---
export const MOCK_USER = {
  id: 'user-1',
  full_name: 'أحمد القحطاني',
  role: UserRole.ADMIN,
  center_id: 'center-1'
};

export const MOCK_CENTERS: Center[] = [
  { id: 'center-1', name: 'مركز الرياض الرئيسي (تجريبي)', location: 'الرياض - حي الملز' },
];

export const MOCK_BRANCHES: Branch[] = [
  { id: 'branch-1', center_id: 'center-1', name: 'فرع الملز النسائي', manager_name: 'أ. نورة الشهري' },
];

export const MOCK_EMPLOYEES: Profile[] = [
  { id: 'emp-1', full_name: 'ياسر القحطاني', role: UserRole.EMPLOYEE, username: 'yasser_q', job_title: 'مقدم خدمة عملاء', branch_id: 'branch-1', center_id: 'center-1' },
];

export const MOCK_VISIT_RECORDS = [
  { id: 'rec-1', center_name: 'مركز الرياض الرئيسي', visit_date: '2024-05-20', inspector: 'أحمد القحطاني', score: 188 },
];

export const MOCK_QUESTIONS_VISIT = [
  { id: 'q1', category: '1- النظافة والمظهر العام', text: 'نظافة منطقة الاستقبال وصالة الانتظار', max_score: 15, mechanism: 'يتم خصم 5 درجات عن كل ملاحظة سلبية' },
  { id: 'q2', category: '1- النظافة والمظهر العام', text: 'نظافة وسلامة الواجهات الخارجية واللوحات', max_score: 10, mechanism: 'فحص الإضاءة، نظافة الزجاج' },
  { id: 'q4', category: '2- الانضباط والمظهر المهني', text: 'الالتزام بالزي الرسمي المعتمد والبطاقة التعريفية', max_score: 20, mechanism: 'خصم 5 درجات لكل موظف مخالف' },
  { id: 'q6', category: '3- جودة العمليات والأنظمة', text: 'الالتزام بسكريبتات الترحيب والتعامل مع العميل', max_score: 20, mechanism: 'تقييم من خلال العميل الخفي' },
  { id: 'q8', category: '4- الإدارة والمراجعة الميدانية', text: 'توثيق سجلات الاجتماعات الصباحية للفريق', max_score: 20, mechanism: 'وجود محاضر موقعة' },
  { id: 'q10', category: '5- الغرف الفنية والأرشفة', text: 'نظافة وترتيب غرفة الخوادم (Server Room)', max_score: 20, mechanism: 'تنظيم الكابلات، درجة الحرارة' },
];
