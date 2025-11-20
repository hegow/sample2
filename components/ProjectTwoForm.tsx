import React, { useEffect, useRef } from 'react';
import { ChallengeRow } from '../types';
import { GlassCard, GlassInput, GlassTextArea, GlassButton, GlassProgressBar } from './GlassComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: ChallengeRow[];
  onChange: (data: ChallengeRow[]) => void;
}

const ProjectTwoForm: React.FC<Props> = ({ data, onChange }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const addRow = () => {
    const newRow: ChallengeRow = {
      id: Date.now().toString(),
      name: '',
      problem: '',
      urgency: '',
      visualProblem: '',
      bridgeSentence: 'ما ادامه دهنده راه نیاکانمون هستیم',
      bridgeVisual: '',
      rejectedIdeas: '',
      strategy: '',
      execution: '',
      result: '',
      slogan: '',
      cta: ''
    };
    onChange([...data, newRow]);
  };

  const removeRow = (id: string) => {
    onChange(data.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof ChallengeRow, value: string) => {
    const newData = data.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    onChange(newData);
  };

  const handleBlur = (index: number) => {
    if (index === data.length - 1) {
      const row = data[index];
      if (row.name && row.problem && row.strategy) {
        addRow();
      }
    }
  };

  const calculateProgress = () => {
     const p2Total = Math.max(1, data.length * 5);
    let p2Filled = 0;
    data.forEach(row => {
        if (row.name) p2Filled++;
        if (row.problem) p2Filled++;
        if (row.strategy) p2Filled++;
        if (row.execution) p2Filled++;
        if (row.result) p2Filled++;
    });
    return data.length === 0 ? 0 : Math.min(100, Math.round((p2Filled / p2Total) * 100));
  }

  useEffect(() => {
    if (data.length === 0) addRow();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data.length]);

  return (
    <div className="w-full max-w-6xl mx-auto">
       <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm text-indigo-300 font-bold">میزان تکمیل اطلاعات چالش‌ها</span>
            <span className="text-xs text-gray-400">{calculateProgress()}%</span>
       </div>
       <GlassProgressBar progress={calculateProgress()} className="mb-6" />

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-indigo-300">سریال چالش‌ها (۱۰ تا ۱۵ ویدیو)</h3>
        <GlassButton onClick={addRow} variant="success" className="flex items-center text-sm">
          <Plus size={16} className="mr-2" /> افزودن چالش جدید
        </GlassButton>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {data.map((row, index) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="relative group border-l-4 border-indigo-500">
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="mb-4 border-b border-white border-opacity-10 pb-2 flex items-center">
                  <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold ml-3">{index + 1}</span>
                  <h4 className="font-bold text-lg text-white">چالش شماره {index + 1}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Hook */}
                  <div className="md:col-span-3 bg-indigo-900 bg-opacity-20 p-4 rounded-xl border border-indigo-500 border-opacity-30">
                    <h5 className="text-sm text-indigo-300 mb-4 font-bold border-b border-indigo-500 border-opacity-20 pb-2">۱. هوک (بیان مسئله)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       <GlassInput label="نام چالش" helperText="یک تیتر جذاب برای این قسمت" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} />
                       <GlassInput label="حس و حال" helperText="این مشکل چقدر اورژانسی یا خطرناک بود؟" value={row.urgency} onChange={(e) => updateRow(row.id, 'urgency', e.target.value)} />
                       <GlassTextArea label="توضیح مشکل" helperText="دقیقا چه اتفاقی افتاد یا چه مانعی وجود داشت؟" value={row.problem} onChange={(e) => updateRow(row.id, 'problem', e.target.value)} className="h-20" />
                       <GlassInput label="تصویرسازی مشکل" helperText="المان بصری (آب‌گرفتگی، ریزش کوه...)" value={row.visualProblem} onChange={(e) => updateRow(row.id, 'visualProblem', e.target.value)} />
                    </div>
                  </div>

                  {/* Intro */}
                  <div className="md:col-span-3 bg-purple-900 bg-opacity-20 p-4 rounded-xl border border-purple-500 border-opacity-30">
                    <h5 className="text-sm text-purple-300 mb-4 font-bold border-b border-purple-500 border-opacity-20 pb-2">۲. اینترو (رابط)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       <GlassInput label="جمله رابط" helperText="ثابت یا متغیر برای این قسمت" value={row.bridgeSentence} onChange={(e) => updateRow(row.id, 'bridgeSentence', e.target.value)} />
                       <GlassInput label="المان بصری رابط" helperText="لوگوموشن یا ترنزیشن خاص؟" value={row.bridgeVisual} onChange={(e) => updateRow(row.id, 'bridgeVisual', e.target.value)} />
                    </div>
                  </div>

                  {/* Meat */}
                  <div className="md:col-span-3 bg-blue-900 bg-opacity-20 p-4 rounded-xl border border-blue-500 border-opacity-30">
                     <h5 className="text-sm text-blue-300 mb-4 font-bold border-b border-blue-500 border-opacity-20 pb-2">۳. استراتژی و اجرا (بدنه اصلی)</h5>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       <GlassInput label="اتاق فکر" helperText="چه ایده‌هایی رد شد؟ (اختیاری)" value={row.rejectedIdeas} onChange={(e) => updateRow(row.id, 'rejectedIdeas', e.target.value)} />
                       <GlassInput label="راه حل نهایی" helperText="استراتژی دقیق فنی چه بود؟" value={row.strategy} onChange={(e) => updateRow(row.id, 'strategy', e.target.value)} />
                       <GlassTextArea label="نحوه اجرا" helperText="چگونه پیاده شد؟ (دستگاه خاص؟ شیفت کاری؟)" value={row.execution} onChange={(e) => updateRow(row.id, 'execution', e.target.value)} className="h-20" />
                       <GlassInput label="نتیجه" helperText="صرفه‌جویی؟ اتمام زودتر؟" value={row.result} onChange={(e) => updateRow(row.id, 'result', e.target.value)} onBlur={() => handleBlur(index)} />
                     </div>
                  </div>

                  {/* Outro */}
                  <div className="md:col-span-3 bg-emerald-900 bg-opacity-20 p-4 rounded-xl border border-emerald-500 border-opacity-30">
                     <h5 className="text-sm text-emerald-300 mb-4 font-bold border-b border-emerald-500 border-opacity-20 pb-2">۴. خروجی</h5>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       <GlassInput label="شعار این قسمت" helperText="ثابت برند یا متناسب با موضوع؟" value={row.slogan} onChange={(e) => updateRow(row.id, 'slogan', e.target.value)} />
                       <GlassInput label="کال تو اکشن" helperText="بیننده چه کند؟ (تماس، بازدید...)" value={row.cta} onChange={(e) => updateRow(row.id, 'cta', e.target.value)} />
                     </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ProjectTwoForm;