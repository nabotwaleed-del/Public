
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Save, FileText, ChevronRight, ChevronDown, 
  Building2, GitBranch, Users, UserPlus, Key, ShieldCheck, 
  LayoutGrid, MapPin, Briefcase, Lock, Loader2, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw
} from 'lucide-react';
import { 
  supabase, 
  isLive, 
  MOCK_CENTERS, 
  MOCK_BRANCHES, 
  MOCK_EMPLOYEES 
} from '../lib/supabase';
import { QuestionType, Question, Center, Branch, Profile, UserRole } from '../types';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forms' | 'organization'>('organization');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Organization State
  const [centers, setCenters] = useState<Center[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    
    if (!isLive) {
      setCenters(MOCK_CENTERS);
      setBranches(MOCK_BRANCHES);
      setEmployees(MOCK_EMPLOYEES as any);
      setExpandedItems({ [MOCK_CENTERS[0].id]: true });
      setLoading(false);
      return;
    }

    try {
      // جلب المراكز
      const { data: cData, error: cErr } = await supabase.from('centers').select('*').order('name');
      if (cErr) throw cErr;
      setCenters(cData || []);

      // جلب الفروع
      const { data: bData, error: bErr } = await supabase.from('branches').select('*').order('name');
      if (bErr) throw bErr;
      setBranches(bData || []);

      // جلب الموظفين
      const { data: pData, error: pErr } = await supabase.from('profiles').select('*').order('full_name');
      if (pErr) throw pErr;
      setEmployees(pData as any || []);
      
      if (cData && cData.length > 0) {
        setExpandedItems({ [cData[0].id]: true });
      }
    } catch (err: any) {
      console.error("Supabase Fetch Error:", err);
      setError("فشل في مزامنة البيانات الحية. تأكد من إعدادات الربط.");
      // Fallback to mocks
      setCenters(MOCK_CENTERS);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCenter = async () => {
    const name = prompt('أدخل اسم المركز الجديد:');
    const location = prompt('أدخل موقع المركز:');
    
    if (!name) return;

    if (!isLive) {
      const newMocKCenter = { id: `mock-${Date.now()}`, name, location: location || 'غير محدد' };
      setCenters([...centers, newMocKCenter]);
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('centers')
        .insert([{ name, location: location || 'غير محدد' }])
        .select();

      if (error) throw error;
      if (data) setCenters([...centers, data[0]]);
    } catch (err: any) {
      alert("خطأ أثناء الإضافة: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCenter = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذا المركز وجميع الفروع التابعة له؟')) return;

    if (!isLive) {
      setCenters(centers.filter(c => c.id !== id));
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('centers').delete().eq('id', id);
      if (error) throw error;
      setCenters(centers.filter(c => c.id !== id));
    } catch (err: any) {
      alert("خطأ أثناء الحذف: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderStatusBanner = () => (
    <div className={`p-4 rounded-2xl border flex items-center justify-between mb-6 transition-all ${isLive ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
       <div className="flex items-center gap-3">
         {isLive ? <CheckCircle2 className="text-emerald-500 animate-pulse" /> : <AlertTriangle className="text-amber-500" />}
         <div>
            <p className="text-sm font-black">حالة النظام: {isLive ? 'متصل بالسحابة (Live)' : 'وضع العرض (Offline)'}</p>
            <p className="text-[10px] font-bold opacity-75">
              {isLive ? `تم العثور على (${centers.length}) مراكز في قاعدة البيانات.` : 'تأكد من إضافة VITE_SUPABASE_URL في Vercel.'}
            </p>
         </div>
       </div>
       <button 
         onClick={fetchInitialData}
         className="p-2 hover:bg-white/50 rounded-lg transition-colors"
         title="تحديث البيانات"
       >
         <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
       </button>
    </div>
  );

  const renderOrganizationTab = () => {
    if (loading && centers.length === 0) return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-emerald-600">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-bold">جاري مزامنة الهيكل التنظيمي من Supabase...</p>
      </div>
    );

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {renderStatusBanner()}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
           <div>
              <h2 className="text-2xl font-black text-slate-800">إدارة الأصول التنظيمية</h2>
              <p className="text-sm text-slate-500 mt-1">المزامنة فورية مع قاعدة البيانات المركزية</p>
           </div>
           <button 
             onClick={handleAddCenter}
             disabled={saving}
             className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg text-sm disabled:opacity-50"
           >
             {saving ? <Loader2 size={18} className="animate-spin ml-2" /> : <Plus size={18} className="ml-2" />}
             إضافة مركز جديد
           </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {centers.length === 0 && !loading && (
            <div className="p-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="font-bold text-slate-400">لا توجد مراكز مضافة حالياً. ابدأ بإضافة أول مركز.</p>
            </div>
          )}
          {centers.map(center => (
            <div key={center.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden group hover:border-emerald-200 transition-all">
              <div 
                className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${expandedItems[center.id] ? 'bg-emerald-50/20' : 'hover:bg-slate-50'}`}
                onClick={() => toggleExpand(center.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 bg-white border rounded-2xl shadow-sm transition-colors ${isLive ? 'border-emerald-100 text-emerald-600' : 'border-slate-100 text-slate-400'}`}>
                    <Building2 size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-black text-slate-800">{center.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin size={12} className="text-emerald-500" />
                      <span className="text-[10px] font-bold">{center.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <button className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDeleteCenter(e, center.id)}>
                     <Trash2 size={18} />
                   </button>
                   {expandedItems[center.id] ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                </div>
              </div>

              {expandedItems[center.id] && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                  {branches.filter(b => b.center_id === center.id).length === 0 ? (
                    <p className="text-center py-4 text-[10px] font-bold text-slate-400">لا توجد فروع مضافة لهذا المركز بعد.</p>
                  ) : (
                    branches.filter(b => b.center_id === center.id).map(branch => (
                      <div key={branch.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <GitBranch size={18} className="text-slate-400" />
                           <span className="font-bold text-slate-700">{branch.name}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                             {employees.filter(e => e.branch_id === branch.id).length} موظف
                           </span>
                           <button className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                         </div>
                      </div>
                    ))
                  )}
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 hover:border-emerald-200 hover:text-emerald-500 transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> إضافة فرع للمركز
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit border border-slate-200">
        <button 
          onClick={() => setActiveTab('forms')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'forms' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <LayoutGrid size={18} />
          إدارة النماذج
        </button>
        <button 
          onClick={() => setActiveTab('organization')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'organization' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Building2 size={18} />
          الهيكل التنظيمي
        </button>
      </div>

      {activeTab === 'organization' ? renderOrganizationTab() : (
        <div className="bg-white p-20 rounded-[40px] border border-slate-200 text-center">
           <FileText size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-bold">جاري العمل على واجهة النماذج...</p>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
