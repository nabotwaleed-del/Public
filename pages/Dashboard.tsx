
import React from 'react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const data = [
  { name: 'الرياض', score: 92 },
  { name: 'جدة', score: 88 },
  { name: 'الدمام', score: 76 },
  { name: 'الخبر', score: 82 },
  { name: 'مكة', score: 95 },
  { name: 'المدينة', score: 89 },
];

const trendData = [
  { month: 'يناير', performance: 65 },
  { month: 'فبراير', performance: 72 },
  { month: 'مارس', performance: 68 },
  { month: 'أبريل', performance: 85 },
  { month: 'مايو', performance: 88 },
  { month: 'يونيو', performance: 92 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-2 text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center space-x-2 space-x-reverse text-sm">
      {change > 0 ? (
        <span className="flex items-center text-emerald-600 font-bold">
          <ArrowUpRight size={16} className="ml-1" />
          {change}%
        </span>
      ) : (
        <span className="flex items-center text-rose-600 font-bold">
          <ArrowDownRight size={16} className="ml-1" />
          {Math.abs(change)}%
        </span>
      )}
      <span className="text-slate-400">مقارنة بالشهر الماضي</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="متوسط تقييم المراكز" 
          value="87.5%" 
          change={4.2} 
          icon={TrendingUp} 
          color="emerald" 
        />
        <StatCard 
          title="الزيارات المنجزة" 
          value="42" 
          change={12} 
          icon={CheckCircle2} 
          color="blue" 
        />
        <StatCard 
          title="زيارات قيد الانتظار" 
          value="18" 
          change={-2.5} 
          icon={Clock} 
          color="amber" 
        />
        <StatCard 
          title="شكاوى لم تُعالج" 
          value="07" 
          change={8} 
          icon={AlertCircle} 
          color="rose" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Comparison Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">ترتيب المراكز (الأداء الميداني)</h3>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
              <option>آخر 3 أشهر</option>
              <option>هذا العام</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80} 
                  tick={{ fontSize: 13, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 85 ? '#10b981' : entry.score > 75 ? '#3b82f6' : '#f59e0b'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">تطور الأداء العام</h3>
            <div className="flex space-x-2 space-x-reverse">
              <span className="flex items-center text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">الهدف: 90%</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
