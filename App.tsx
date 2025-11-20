import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Save, Archive, Video, Layers, PenTool, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { ClientData, Tab } from './types';
import { saveData, loadData, saveBackup, loadBackup } from './services/api';
import { GlassCard, GlassButton, GlassInput, GlassProgressBar } from './components/GlassComponents';
import ProjectOneForm from './components/ProjectOneForm';
import ProjectTwoForm from './components/ProjectTwoForm';
import ProjectThreeForm from './components/ProjectThreeForm';
import AdminDashboard from './components/AdminDashboard';

const INITIAL_DATA: ClientData = {
  projectOne: {
    whyUs: { duration: '', style: '', advantages: '', visualFactors: '', painPoints: '', visualSymbols: '', coreMessage: '', cta: '', visualImagery: '' },
    whatWeDo: { duration: '', structure: '', coreMessage: '', environment: '', servicesList: '', workflow: '', equipment: '', finalOutput: '', cta: '', visualImagery: '' },
    exclusive: { duration: '', mood: '', allowComparisons: false, uniqueCapabilities: '', secretSauce: '', comparisonScenario: '', abstractImagery: '', technicalTerms: '', coreMessage: '', cta: '', visualImagery: '' }
  },
  projectTwo: [],
  projectThree: []
};

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string, role: 'client' | 'admin' } | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [data, setData] = useState<ClientData>(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);
  
  // New simple logic: true if any change happened, false ONLY after successful save
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Calculate Progress
  const progress = useMemo(() => {
    // Project 1
    const p1Total = 28; 
    let p1Filled = 0;
    Object.values(data.projectOne).forEach(section => {
        Object.values(section).forEach(val => {
            if (val && val !== false) p1Filled++;
        });
    });
    const p1Percent = Math.min(100, Math.round((p1Filled / p1Total) * 100));

    // Project 2
    const p2Total = Math.max(1, data.projectTwo.length * 5);
    let p2Filled = 0;
    data.projectTwo.forEach(row => {
        if (row.name) p2Filled++;
        if (row.problem) p2Filled++;
        if (row.strategy) p2Filled++;
        if (row.execution) p2Filled++;
        if (row.result) p2Filled++;
    });
    const p2Percent = data.projectTwo.length === 0 ? 0 : Math.min(100, Math.round((p2Filled / p2Total) * 100));

    // Project 3
    const p3Total = Math.max(1, data.projectThree.length * 3);
    let p3Filled = 0;
    data.projectThree.forEach(row => {
        if (row.title) p3Filled++;
        if (row.elements) p3Filled++;
        if (row.link) p3Filled++;
    });
    const p3Percent = data.projectThree.length === 0 ? 0 : Math.min(100, Math.round((p3Filled / p3Total) * 100));

    return { p1: p1Percent, p2: p2Percent, p3: p3Percent };
  }, [data]);

  // Load Data Logic
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const targetUser = user.role === 'admin' ? 'amirsoofi' : user.name;
        
        // Try fetching from Firebase
        const serverData = await loadData(targetUser);
        
        if (serverData) {
          setData(serverData);
          setHasUnsavedChanges(false); // Data loaded from DB is considered "saved"
        } else {
          // Fallback to Local Storage if server is empty/down
          const localData = loadBackup(targetUser);
          if (localData) {
            setData(localData);
            setHasUnsavedChanges(true); // Loaded from local but not on server yet -> Unsaved
          } else {
             setData(INITIAL_DATA);
             setHasUnsavedChanges(false);
          }
        }
      }
    };
    fetchData();
  }, [user]);

  // Auto-backup to localStorage (Safety net only)
  useEffect(() => {
    if (user && user.role === 'client') {
      saveBackup(user.name, data);
      
      // Browser close warning
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (hasUnsavedChanges) {
          e.preventDefault();
          e.returnValue = '';
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [data, user, hasUnsavedChanges]);

  // Helper to update data and flag as dirty
  const handleDataUpdate = (newData: ClientData) => {
    setData(newData);
    if (user?.role === 'client') {
        setHasUnsavedChanges(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (isAdminLogin) {
        if (usernameInput === 'arshia' && passwordInput === '4523') {
            setUser({ name: 'arshia', role: 'admin' });
        } else {
            setLoginError('اطلاعات مدیر اشتباه است');
        }
    } else {
        if (usernameInput === 'amirsoofi' && passwordInput === '4523') {
            setUser({ name: 'amirsoofi', role: 'client' });
        } else {
             setLoginError('نام کاربری یا رمز عبور اشتباه است');
        }
    }
  };

  const handleSave = async () => {
    if (!user || user.role === 'admin') return; 
    
    setIsSaving(true);
    try {
      const result = await saveData(user.name, data);
      
      if (result.success) {
        setHasUnsavedChanges(false); // CRITICAL: Only set to false here
        alert('✅ اطلاعات با موفقیت در فایربیس ذخیره شد.');
      } else {
        alert(`❌ خطا در ذخیره‌سازی: ${result.message}`);
      }
    } catch (error) {
      alert("❌ خطای غیرمنتظره در ارتباط با سرور");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // Strict boolean check
    if (user?.role === 'client' && hasUnsavedChanges) {
      alert('⚠️ شما تغییرات ذخیره نشده دارید!\n\nلطفاً ابتدا دکمه "ذخیره نهایی" (سبز رنگ) را بزنید تا اطلاعات در دیتابیس ثبت شود، سپس خارج شوید.');
      return; 
    }

    setUser(null);
    setData(INITIAL_DATA);
    setHasUnsavedChanges(false);
    setUsernameInput('');
    setPasswordInput('');
    setIsAdminLogin(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <h1 className="text-3xl font-bold mb-2 tracking-wider text-white mt-4">Briefing Page</h1>
          <p className="text-gray-400 mb-8">{isAdminLogin ? 'پنل مدیریت استودیو' : 'تکمیل اطلاعات پروژه'}</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <GlassInput 
              label="نام کاربری" 
              value={usernameInput} 
              onChange={e => setUsernameInput(e.target.value)} 
              placeholder={isAdminLogin ? "arshia" : "amirsoofi"}
            />
            <GlassInput 
              label="رمز عبور" 
              type="password" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)}
            />
            {loginError && <p className="text-red-400 text-sm bg-red-900 bg-opacity-20 p-2 rounded">{loginError}</p>}
            <GlassButton type="submit" className="w-full mt-4">
                {isAdminLogin ? 'ورود مدیر' : 'ورود به سیستم'}
            </GlassButton>
          </form>
          
          <div className="mt-6 pt-4 border-t border-white border-opacity-10">
             <button 
                onClick={() => { setIsAdminLogin(!isAdminLogin); setLoginError(''); }}
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center w-full"
             >
                {isAdminLogin ? 'بازگشت به ورود مشتری' : 'ورود مدیر سیستم'}
             </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ADMIN VIEW
  if (user.role === 'admin') {
      return (
        <div className="min-h-screen bg-gray-900 text-right dir-rtl pb-10">
            <nav className="bg-gray-800 p-4 shadow-lg flex justify-between items-center border-b border-gray-700 sticky top-0 z-50">
                <div className="flex items-center text-white">
                    <Shield className="mr-2 text-emerald-400" />
                    <span className="font-bold mr-2">پنل مدیریت</span>
                </div>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm flex items-center">
                    <LogOut size={16} className="ml-1" /> خروج
                </button>
            </nav>
            <div className="p-4 md:p-8">
                <AdminDashboard data={data} clientName="امیر صوفی" />
            </div>
        </div>
      );
  }

  // CLIENT VIEW
  return (
    <div className="min-h-screen flex flex-col md:flex-row text-right dir-rtl">
      {/* Sidebar */}
      <nav className="w-full md:w-72 bg-gray-900 bg-opacity-60 backdrop-blur-xl border-l border-white border-opacity-10 flex flex-col p-4 z-10">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-white">پروژه امیر صوفی</h2>
          <span className="text-xs text-green-400 bg-green-900 bg-opacity-30 px-2 py-1 rounded-full flex items-center justify-center w-20 mx-auto mt-2">
             <span className="w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse"></span> آنلاین
          </span>
        </div>
        
        <div className="space-y-4 flex-1">
          <SidebarItem 
            icon={<Archive />} label="داشبورد" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          
          <div className="space-y-1">
            <SidebarItem 
                icon={<Video />} label="۱. موشن گرافیک‌ها" 
                active={activeTab === 'project1'} 
                onClick={() => setActiveTab('project1')} 
            />
            <div className="px-4">
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>تکمیل شده</span>
                    <span>{progress.p1}%</span>
                 </div>
                 <GlassProgressBar progress={progress.p1} className="h-1" />
            </div>
          </div>

          <div className="space-y-1">
             <SidebarItem 
                icon={<Layers />} label="۲. سریال چالش‌ها" 
                active={activeTab === 'project2'} 
                onClick={() => setActiveTab('project2')} 
             />
              <div className="px-4">
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>تکمیل شده</span>
                    <span>{progress.p2}%</span>
                 </div>
                 <GlassProgressBar progress={progress.p2} className="h-1" />
            </div>
          </div>

          <div className="space-y-1">
             <SidebarItem 
                icon={<PenTool />} label="۳. آیکون‌های متحرک" 
                active={activeTab === 'project3'} 
                onClick={() => setActiveTab('project3')} 
             />
             <div className="px-4">
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>تکمیل شده</span>
                    <span>{progress.p3}%</span>
                 </div>
                 <GlassProgressBar progress={progress.p3} className="h-1" />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white border-opacity-10 space-y-2">
          <GlassButton 
            variant={hasUnsavedChanges ? "danger" : "success"} 
            className={`w-full flex justify-center items-center ${hasUnsavedChanges ? 'animate-pulse' : ''}`}
            onClick={handleSave}
            loading={isSaving}
          >
            <Save size={18} className="ml-2" /> 
            {hasUnsavedChanges ? 'ذخیره تغییرات' : 'ذخیره شده'}
          </GlassButton>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center py-2 rounded-lg text-sm transition-colors ${hasUnsavedChanges ? 'text-gray-500 cursor-not-allowed' : 'text-red-400 hover:text-red-300'}`}
          >
            {hasUnsavedChanges && <AlertTriangle size={14} className="ml-1 text-yellow-500" />}
            <LogOut size={16} className="ml-2" /> خروج از حساب
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
             <motion.div 
               key="dashboard"
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
               className="grid grid-cols-1 md:grid-cols-3 gap-6"
             >
               <GlassCard className="col-span-full mb-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-transparent border-none">
                 <div className="flex items-start">
                    <div className="p-3 bg-white bg-opacity-10 rounded-full ml-4">
                        <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-white">خوش آمدید، {user.name}</h1>
                        <p className="text-indigo-200 leading-relaxed">لطفا برای شروع، یکی از پروژه‌های زیر را انتخاب کنید. پس از اتمام کار، حتما دکمه <span className="font-bold text-white">ذخیره نهایی</span> را بزنید.</p>
                    </div>
                 </div>
               </GlassCard>

               <ProjectCard 
                 title="موشن گرافیک‌های اصلی" 
                 desc="Why Us, What We Do, Exclusive"
                 icon={<Video size={32} />}
                 onClick={() => setActiveTab('project1')}
                 progress={progress.p1}
               />
               <ProjectCard 
                 title="سریال چالش‌ها" 
                 desc="۱۰ تا ۱۵ ویدیو با ساختار ثابت"
                 icon={<Layers size={32} />}
                 onClick={() => setActiveTab('project2')}
                 progress={progress.p2}
               />
               <ProjectCard 
                 title="آیکون‌های متحرک" 
                 desc="لوپ‌های وکتور برای سایت"
                 icon={<PenTool size={32} />}
                 onClick={() => setActiveTab('project3')}
                 progress={progress.p3}
               />
             </motion.div>
          )}

          {activeTab === 'project1' && (
            <motion.div key="p1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ProjectOneForm data={data.projectOne} onChange={(newData) => handleDataUpdate({...data, projectOne: newData})} />
            </motion.div>
          )}

          {activeTab === 'project2' && (
            <motion.div key="p2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ProjectTwoForm data={data.projectTwo} onChange={(newData) => handleDataUpdate({...data, projectTwo: newData})} />
            </motion.div>
          )}

          {activeTab === 'project3' && (
            <motion.div key="p3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ProjectThreeForm data={data.projectThree} onChange={(newData) => handleDataUpdate({...data, projectThree: newData})} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${active ? 'bg-white bg-opacity-20 text-white font-bold shadow-lg border border-white border-opacity-10' : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'}`}
  >
    <span className="ml-3">{icon}</span>
    {label}
  </button>
);

const ProjectCard: React.FC<{ title: string, desc: string, icon: React.ReactNode, onClick: () => void, progress: number }> = ({ title, desc, icon, onClick, progress }) => (
  <GlassCard 
    className="cursor-pointer hover:bg-opacity-20 transition-all group relative overflow-hidden" 
    onClick={onClick}
  >
    <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
    <div className="flex flex-col items-center text-center">
      <div className="p-4 bg-indigo-600 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/50">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{desc}</p>
      <span className="text-xs font-bold px-3 py-1 bg-white bg-opacity-10 rounded-full text-indigo-300">{progress}% تکمیل شده</span>
    </div>
  </GlassCard>
);

export default App;