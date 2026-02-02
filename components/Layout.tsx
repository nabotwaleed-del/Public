
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  MapPin, 
  Users, 
  FileBarChart, 
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.REVIEWER] },
    { id: 'visits', label: 'الزيارات الميدانية', icon: MapPin, roles: [UserRole.ADMIN, UserRole.REVIEWER] },
    { id: 'manager', label: 'تقييم الموظفين', icon: UserCheck, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'employee', label: 'التقييم الذاتي', icon: Users, roles: [UserRole.EMPLOYEE, UserRole.ADMIN] },
    { id: 'reports', label: 'التقارير والإحصائيات', icon: FileBarChart, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.REVIEWER] },
    { id: 'admin', label: 'الإعدادات والنماذج', icon: Settings, roles: [UserRole.ADMIN] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-emerald-400">نظام التقييم</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'ml-3' : 'ml-0 mx-auto'} />
              {isSidebarOpen && <span className="font-medium text-sm leading-none pt-1">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
            <LogOut size={20} className={isSidebarOpen ? 'ml-3' : 'mx-auto'} />
            {isSidebarOpen && <span className="font-medium text-sm">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4 space-x-reverse">
            <h1 className="text-lg font-bold text-slate-800">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 leading-none">أحمد القحطاني</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">مدير نظام</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold border-2 border-emerald-500 shadow-sm">
              أق
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
