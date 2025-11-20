import React, { useEffect } from 'react';
import { IconRow } from '../types';
import { GlassCard, GlassInput, GlassButton, GlassProgressBar } from './GlassComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Repeat, PlayCircle } from 'lucide-react';

interface Props {
  data: IconRow[];
  onChange: (data: IconRow[]) => void;
}

const ProjectThreeForm: React.FC<Props> = ({ data, onChange }) => {
  
  const addRow = () => {
    const newRow: IconRow = {
      id: Date.now().toString(),
      title: '',
      contextText: '',
      elements: '',
      actionType: 'loop',
      link: ''
    };
    onChange([...data, newRow]);
  };

  const removeRow = (id: string) => {
    onChange(data.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof IconRow, value: string) => {
    const newData = data.map(row => {
      if (row.id === id) return { ...row, [field]: value };
      return row;
    });
    onChange(newData);
  };

  const handleBlur = (index: number) => {
    if (index === data.length - 1) {
      const row = data[index];
      if (row.title && row.elements) {
        addRow();
      }
    }
  };

  const calculateProgress = () => {
    const p3Total = Math.max(1, data.length * 3);
    let p3Filled = 0;
    data.forEach(row => {
        if (row.title) p3Filled++;
        if (row.elements) p3Filled++;
        if (row.link) p3Filled++;
    });
    return data.length === 0 ? 0 : Math.min(100, Math.round((p3Filled / p3Total) * 100));
  }

  useEffect(() => {
    if (data.length === 0) addRow();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm text-indigo-300 font-bold">میزان تکمیل لیست آیکون‌ها</span>
            <span className="text-xs text-gray-400">{calculateProgress()}%</span>
       </div>
       <GlassProgressBar progress={calculateProgress()} className="mb-6" />

       <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-indigo-300">لوپ‌های وکتور انیمیشن (آیکون‌ها)</h3>
        <GlassButton onClick={addRow} variant="success" className="flex items-center text-sm">
          <Plus size={16} className="mr-2" /> افزودن آیکون
        </GlassButton>
      </div>

      <GlassCard className="overflow-x-auto bg-opacity-5">
        <table className="w-full min-w-[900px] text-right border-collapse">
          <thead>
            <tr className="border-b border-white border-opacity-20 text-indigo-200 text-sm">
              <th className="p-4 w-10">#</th>
              <th className="p-4 w-1/5">عنوان و متن</th>
              <th className="p-4 w-1/4">المان‌های بصری</th>
              <th className="p-4 w-1/4">نوع حرکت</th>
              <th className="p-4 w-1/6">لینک / مکان</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="align-top">
             <AnimatePresence>
               {data.map((row, index) => (
                 <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition-colors"
                 >
                   <td className="p-4 text-gray-400 font-bold">{index + 1}</td>
                   <td className="p-3">
                     <div className="space-y-2">
                        <input 
                           placeholder="عنوان: مثلا سرعت اجرا" 
                           value={row.title} onChange={(e) => updateRow(row.id, 'title', e.target.value)} 
                           className="w-full bg-transparent border-b border-white border-opacity-20 focus:border-indigo-400 focus:outline-none text-white pb-1 font-bold placeholder-gray-500"
                        />
                        <textarea
                          rows={2}
                          placeholder="متن زیر آیکون در سایت..."
                          className="w-full bg-white bg-opacity-5 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                          value={row.contextText}
                          onChange={(e) => updateRow(row.id, 'contextText', e.target.value)}
                        />
                     </div>
                   </td>
                   <td className="p-3">
                      <GlassInput 
                        label="" placeholder="پیشنهاد: کرنومتر، موشک..." 
                        value={row.elements} onChange={(e) => updateRow(row.id, 'elements', e.target.value)} 
                        className="mb-0 text-sm"
                      />
                   </td>
                   <td className="p-3">
                      <div className="flex flex-col space-y-2">
                        <button 
                            onClick={() => updateRow(row.id, 'actionType', 'loop')}
                            className={`flex items-center px-3 py-2 rounded-lg text-xs transition-all ${row.actionType === 'loop' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white bg-opacity-5 text-gray-400 hover:bg-opacity-10'}`}
                        >
                            <Repeat size={14} className="ml-2" /> لوپ بی‌پایان
                        </button>
                         <button 
                            onClick={() => updateRow(row.id, 'actionType', 'once')}
                            className={`flex items-center px-3 py-2 rounded-lg text-xs transition-all ${row.actionType === 'once' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white bg-opacity-5 text-gray-400 hover:bg-opacity-10'}`}
                        >
                            <PlayCircle size={14} className="ml-2" /> یک‌بار و توقف
                        </button>
                      </div>
                   </td>
                   <td className="p-3">
                      <GlassInput 
                        label="" placeholder="آدرس یا سکشن در سایت" 
                        value={row.link} onChange={(e) => updateRow(row.id, 'link', e.target.value)} 
                        onBlur={() => handleBlur(index)}
                        className="mb-0 text-sm"
                      />
                   </td>
                   <td className="p-3 text-center flex items-center justify-center h-full pt-8">
                      <button onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-600 transition-colors bg-red-900 bg-opacity-20 p-2 rounded-full hover:bg-opacity-40">
                        <Trash2 size={16} />
                      </button>
                   </td>
                 </motion.tr>
               ))}
             </AnimatePresence>
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

export default ProjectThreeForm;