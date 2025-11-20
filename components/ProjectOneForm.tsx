import React, { useMemo } from 'react';
import { ProjectOneData } from '../types';
import { GlassCard, GlassInput, GlassTextArea, GlassRadioGroup, GlassProgressBar } from './GlassComponents';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: ProjectOneData;
  onChange: (data: ProjectOneData) => void;
}

const ProjectOneForm: React.FC<Props> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = React.useState<'whyUs' | 'whatWeDo' | 'exclusive'>('whyUs');

  const handleChange = (section: keyof ProjectOneData, field: string, value: any) => {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
  };

  const calculateProgress = (sectionData: any) => {
    const values = Object.values(sectionData);
    const filled = values.filter(v => v && v !== false).length;
    return Math.min(100, Math.round((filled / values.length) * 100));
  };

  const tabs = [
    { id: 'whyUs', label: 'ویدیوی ۱: مزیت‌ها' },
    { id: 'whatWeDo', label: 'ویدیوی ۲: شرح خدمات' },
    { id: 'exclusive', label: 'ویدیوی ۳: توانمندی‌ها' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex space-x-reverse space-x-2 mb-6 border-b border-white border-opacity-20 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2 rounded-t-lg transition-all whitespace-nowrap ml-2 ${
              activeTab === tab.id 
                ? 'bg-white bg-opacity-20 text-white font-bold border-b-2 border-indigo-400' 
                : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'whyUs' && (
          <motion.div
            key="whyUs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-sm text-indigo-300 font-bold">وضعیت تکمیل فرم مزیت‌ها</span>
                <span className="text-xs text-gray-400">{calculateProgress(data.whyUs)}%</span>
            </div>
            <GlassProgressBar progress={calculateProgress(data.whyUs)} className="mb-6" />
            
            <GlassCard>
              <h3 className="text-xl font-bold mb-4 text-indigo-300">مزیت‌های رقابتی (Why Us?)</h3>
              <div className="grid grid-cols-1 gap-4">
                <GlassInput 
                  label="مدت زمان" 
                  helperText="مدت زمان تقریبی مورد انتظار (مثلاً ۶۰ ثانیه)"
                  value={data.whyUs.duration}
                  onChange={(e) => handleChange('whyUs', 'duration', e.target.value)}
                />
                <GlassRadioGroup 
                  label="تمپو و ضرب‌آهنگ"
                  value={data.whyUs.style}
                  onChange={(val) => handleChange('whyUs', 'style', val)}
                  options={[
                    { value: 'speed', label: 'سرعتی و پرانرژی', description: 'برای نشان دادن قدرت و چابکی سیستم.' },
                    { value: 'calm', label: 'آرام و باوقار', description: 'برای نشان دادن قدمت، اطمینان و آرامش.' },
                    { value: 'other', label: 'گزینه جدید', description: 'لطفا سبک مورد نظر خود را در توضیحات بنویسید.' },
                  ]}
                />
              </div>
              <GlassTextArea 
                label="لیست ۳ تا ۵ مزیت اصلی" 
                helperText="لطفاً به ترتیب اولویت بنویسید. این موارد ستون فقرات سناریو هستند."
                value={data.whyUs.advantages}
                onChange={(e) => handleChange('whyUs', 'advantages', e.target.value)}
              />
              <GlassTextArea 
                label="عامل ایجاد کننده مزیت (برای تصویرسازی)" 
                helperText="مثال: اگر مزیت 'سرعت بالا' است، عامل آن چیست؟ (نیروی انسانی زیاد؟ ماشین آلات مدرن؟)"
                placeholder="عامل اصلی ایجاد این مزیت را شرح دهید..."
                value={data.whyUs.visualFactors}
                onChange={(e) => handleChange('whyUs', 'visualFactors', e.target.value)}
              />
              <GlassTextArea 
                label="نقاط درد مشتریان (Pain Points)" 
                helperText="مشتریان قبل از شما از چه چیزی در شرکت‌های دیگر رنج می‌برند؟ (تاخیر؟ هزینه پنهان؟)"
                value={data.whyUs.painPoints}
                onChange={(e) => handleChange('whyUs', 'painPoints', e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <GlassInput 
                  label="نمادهای بصری" 
                  helperText="گواهینامه، استاندارد یا تندیس خاصی که باید نمایش داده شود."
                  value={data.whyUs.visualSymbols}
                  onChange={(e) => handleChange('whyUs', 'visualSymbols', e.target.value)}
                />
                <GlassInput 
                  label="پیام اصلی (Core Message)" 
                  helperText="اگر مخاطب فقط یک جمله یادش بماند، آن جمله چیست؟"
                  value={data.whyUs.coreMessage}
                  onChange={(e) => handleChange('whyUs', 'coreMessage', e.target.value)}
                />
              </div>
               <GlassInput 
                  label="کال تو اکشن (CTA)" 
                  helperText="در پایان ویدیو از مخاطب چه می‌خواهید؟ (تماس، بازدید سایت...)"
                  value={data.whyUs.cta}
                  onChange={(e) => handleChange('whyUs', 'cta', e.target.value)}
                />
                <GlassTextArea 
                label="تصویرسازی ذهنی شما" 
                helperText="اگر تصویر خاصی در ذهن دارید (مثلاً کرنومتر برای سرعت)، اینجا بنویسید."
                value={data.whyUs.visualImagery}
                onChange={(e) => handleChange('whyUs', 'visualImagery', e.target.value)}
              />
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'whatWeDo' && (
          <motion.div
            key="whatWeDo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
             <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-sm text-indigo-300 font-bold">وضعیت تکمیل فرم شرح خدمات</span>
                <span className="text-xs text-gray-400">{calculateProgress(data.whatWeDo)}%</span>
            </div>
            <GlassProgressBar progress={calculateProgress(data.whatWeDo)} className="mb-6" />

             <GlassCard>
              <h3 className="text-xl font-bold mb-4 text-indigo-300">شرح خدمات (What We Do?)</h3>
              <div className="grid grid-cols-1 gap-4">
                <GlassInput 
                  label="مدت زمان" 
                  helperText="مثلاً ۹۰ ثانیه"
                  value={data.whatWeDo.duration}
                  onChange={(e) => handleChange('whatWeDo', 'duration', e.target.value)}
                />
                <GlassRadioGroup 
                  label="ساختار روایت"
                  value={data.whatWeDo.structure}
                  onChange={(val) => handleChange('whatWeDo', 'structure', val)}
                  options={[
                    { value: 'linear', label: 'خطی و مرحله‌ای', description: 'روایت از صفر تا صد یک پروژه.' },
                    { value: 'categorical', label: 'دسته‌بندی دپارتمانی', description: 'نمایش دپارتمان‌ها به صورت موازی.' },
                    { value: 'other', label: 'سایر', description: 'مدل دیگری مد نظر دارید.' },
                  ]}
                />
              </div>
              <GlassInput 
                  label="فضای محیطی" 
                  helperText="خدمات بیشتر در چه فضایی است؟ (دفتر مهندسی؟ سایت عمرانی؟)"
                  value={data.whatWeDo.environment}
                  onChange={(e) => handleChange('whatWeDo', 'environment', e.target.value)}
                />
              <GlassTextArea 
                label="دسته‌بندی خدمات" 
                helperText="خدمات شرکت دقیقاً به چه بخش‌هایی تقسیم می‌شود؟ (تیره‌وار)"
                value={data.whatWeDo.servicesList}
                onChange={(e) => handleChange('whatWeDo', 'servicesList', e.target.value)}
              />
              <GlassTextArea 
                label="ارتباط خدمات (Workflow)" 
                helperText="آیا خدمات پیش‌نیاز هم هستند؟ (اول طراحی، بعد اجرا؟)"
                value={data.whatWeDo.workflow}
                onChange={(e) => handleChange('whatWeDo', 'workflow', e.target.value)}
              />
              <GlassInput 
                  label="تجهیزات شاخص" 
                  helperText="نام نرم‌افزار خاص یا دستگاه ویژه‌ای که ارزش نمایش دارد."
                  value={data.whatWeDo.equipment}
                  onChange={(e) => handleChange('whatWeDo', 'equipment', e.target.value)}
                />
              <GlassInput 
                  label="تصویر خروجی نهایی" 
                  helperText="در انتها چه تصویر کلی شکل می‌گیرد؟ (یک شهر آباد؟ رضایت کارفرما؟)"
                  value={data.whatWeDo.finalOutput}
                  onChange={(e) => handleChange('whatWeDo', 'finalOutput', e.target.value)}
                />
              <GlassInput 
                  label="پیام اصلی (Core Message)" 
                  helperText="تک جمله‌ای که باید در ذهن مخاطب بماند."
                  value={data.whatWeDo.coreMessage}
                  onChange={(e) => handleChange('whatWeDo', 'coreMessage', e.target.value)}
                />
              <GlassInput 
                  label="کال تو اکشن (CTA)" 
                  helperText="درخواست نهایی از بیننده."
                  value={data.whatWeDo.cta}
                  onChange={(e) => handleChange('whatWeDo', 'cta', e.target.value)}
                />
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'exclusive' && (
          <motion.div
            key="exclusive"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
             <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-sm text-indigo-300 font-bold">وضعیت تکمیل فرم توانمندی‌ها</span>
                <span className="text-xs text-gray-400">{calculateProgress(data.exclusive)}%</span>
            </div>
            <GlassProgressBar progress={calculateProgress(data.exclusive)} className="mb-6" />

             <GlassCard>
              <h3 className="text-xl font-bold mb-4 text-indigo-300">توانمندی‌های انحصاری</h3>
              <div className="grid grid-cols-1 gap-4">
                <GlassInput 
                  label="مدت زمان" 
                  helperText="مدت زمان تقریبی"
                  value={data.exclusive.duration}
                  onChange={(e) => handleChange('exclusive', 'duration', e.target.value)}
                />
                <GlassRadioGroup 
                  label="لحن و حس (Mood)"
                  value={data.exclusive.mood}
                  onChange={(val) => handleChange('exclusive', 'mood', val)}
                  options={[
                    { value: 'pioneer', label: 'پیشگام و نوآور', description: 'ما تکنولوژی آینده را داریم.' },
                    { value: 'powerful', label: 'قدرتمند و حماسی', description: 'ما غیرممکن‌ها را ممکن می‌کنیم.' },
                    { value: 'mysterious', label: 'رازآلود و هوشمند', description: 'ما راهکارهایی داریم که دیگران بلد نیستند.' },
                    { value: 'other', label: 'سایر', description: '' },
                  ]}
                />
              </div>
              <div className="mb-6 flex items-center bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
                <input 
                  type="checkbox" 
                  id="allowCompare"
                  checked={data.exclusive.allowComparisons}
                  onChange={(e) => handleChange('exclusive', 'allowComparisons', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 ml-3"
                />
                <div>
                    <label htmlFor="allowCompare" className="text-sm font-bold text-white block">
                    اجازه نمایش روش‌های منسوخ رقبا (خط قرمز بصری)
                    </label>
                    <p className="text-xs text-gray-400 mt-1">آیا اجازه داریم روش‌های معمول بازار را به عنوان روش‌های "ناکارآمد" نشان دهیم؟</p>
                </div>
              </div>
              <GlassTextArea 
                label="لیست توانایی‌های منحصر‌به‌فرد" 
                helperText="۳ تا ۴ مورد از کارهایی که فقط شما توان انجامش را دارید."
                value={data.exclusive.uniqueCapabilities}
                onChange={(e) => handleChange('exclusive', 'uniqueCapabilities', e.target.value)}
              />
               <GlassTextArea 
                label="منشاء قدرت (The Secret Sauce)" 
                helperText="چه چیزی باعث این توانایی شده؟ (تکنولوژی خاص؟ دانش فنی محرمانه؟)"
                value={data.exclusive.secretSauce}
                onChange={(e) => handleChange('exclusive', 'secretSauce', e.target.value)}
              />
              <GlassTextArea 
                label="مقایسه با وضعیت عادی" 
                helperText="اگر یک شرکت معمولی بخواهد این کارها را انجام دهد چه اتفاقی می‌افتد؟ (شکست؟ هزینه ۱۰ برابر؟)"
                value={data.exclusive.comparisonScenario}
                onChange={(e) => handleChange('exclusive', 'comparisonScenario', e.target.value)}
              />
               <GlassInput 
                  label="تصویرسازی انتزاعی / تشبیه" 
                  helperText="مثلا تشبیه دقت کار به 'جراحی' یا 'ساعت‌سازی'."
                  value={data.exclusive.abstractImagery}
                  onChange={(e) => handleChange('exclusive', 'abstractImagery', e.target.value)}
                />
                 <GlassInput 
                  label="کلمات تخصصی" 
                  helperText="نام تکنولوژی، متدولوژی یا استاندارد خاصی که نشان دهنده سواد بالای شرکت است."
                  value={data.exclusive.technicalTerms}
                  onChange={(e) => handleChange('exclusive', 'technicalTerms', e.target.value)}
                />
                <GlassInput 
                  label="پیام اصلی" 
                  helperText="جمله کلیدی این ویدیو."
                  value={data.exclusive.coreMessage}
                  onChange={(e) => handleChange('exclusive', 'coreMessage', e.target.value)}
                />
                <GlassInput 
                  label="کال تو اکشن" 
                  helperText="درخواست نهایی از مخاطب."
                  value={data.exclusive.cta}
                  onChange={(e) => handleChange('exclusive', 'cta', e.target.value)}
                />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectOneForm;