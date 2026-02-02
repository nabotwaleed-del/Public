
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminSettings from './pages/AdminSettings';
import Visits from './pages/Visits';
import Reports from './pages/Reports';
import EmployeeSelfEval from './pages/EmployeeSelfEval';
import { UserRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <AdminSettings />;
      case 'visits':
        return <Visits />;
      case 'reports':
        return <Reports />;
      case 'manager':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <span className="text-4xl text-slate-300">🏢</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800">بوابة المديرين</h3>
            <p className="text-slate-500 max-w-sm mt-2">جاري العمل على تجهيز لوحة متابعة أداء الموظفين المباشرين.</p>
          </div>
        );
      case 'employee':
        return <EmployeeSelfEval />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-emerald-600">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 font-bold tracking-widest text-emerald-800 animate-pulse">جاري تحميل النظام...</p>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userRole={userRole}
    >
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
