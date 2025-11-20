import React from 'react';
import { ClientData } from '../types';
import { GlassCard, GlassReadOnlyField } from './GlassComponents';
import { motion } from 'framer-motion';
import { FileText, Download, Printer } from 'lucide-react';

interface Props {
  data: ClientData;
  clientName: string;
}

const AdminDashboard: React.FC<Props> = ({ data, clientName }) => {
  const print = () => window.print();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 print:p-0">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">قرارداد و مستندات پروژه</h1>
            <p className="text-indigo-300">کارفرما: {clientName}</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
            <button onClick={print} className="flex items-center bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-2 rounded-lg transition-all">
                <Printer size={20} className="ml-2" /> پرینت / PDF
            </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Project 1 */}
        <section className="relative">
            <div className="absolute -right-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full"></div>
            <GlassCard className="print:bg-white print:text-black">
                <h2 className="text-2xl font-bold text-indigo-400 mb-6 border-b border-white border-opacity-10 pb-4 flex items-center">
                    <FileText className="ml-3" /> پروژه اول: موشن گرافیک‌های اصلی
                </h2>
                
                <h3 className="text-xl font-bold text-white mb-4 mt-6 bg-indigo-900 bg-opacity-40 p-2 rounded">۱. مزیت‌های رقابتی (Why Us)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassReadOnlyField label="مدت زمان" value={data.projectOne.whyUs.duration} />
                    <GlassReadOnlyField label="سبک و تمپو" value={data.projectOne.whyUs.style} />
                    <GlassReadOnlyField label="مزیت‌های اصلی" value={data.projectOne.whyUs.advantages} className="md:col-span-2" />
                    <GlassReadOnlyField label="عامل ایجاد کننده" value={data.projectOne.whyUs.visualFactors} className="md:col-span-2" />
                    <GlassReadOnlyField label="نقاط درد" value={data.projectOne.whyUs.painPoints} />
                    <GlassReadOnlyField label="نمادهای بصری" value={data.projectOne.whyUs.visualSymbols} />
                    <GlassReadOnlyField label="پیام اصلی" value={data.projectOne.whyUs.coreMessage} />
                    <GlassReadOnlyField label="Call to Action" value={data.projectOne.whyUs.cta} />
                    <GlassReadOnlyField label="تصویرسازی ذهنی" value={data.projectOne.whyUs.visualImagery} className="md:col-span-2" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 mt-8 bg-indigo-900 bg-opacity-40 p-2 rounded">۲. شرح خدمات (What We Do)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassReadOnlyField label="مدت زمان" value={data.projectOne.whatWeDo.duration} />
                    <GlassReadOnlyField label="ساختار" value={data.projectOne.whatWeDo.structure} />
                    <GlassReadOnlyField label="فضای محیطی" value={data.projectOne.whatWeDo.environment} />
                    <GlassReadOnlyField label="تجهیزات" value={data.projectOne.whatWeDo.equipment} />
                    <GlassReadOnlyField label="لیست خدمات" value={data.projectOne.whatWeDo.servicesList} className="md:col-span-2" />
                    <GlassReadOnlyField label="Workflow" value={data.projectOne.whatWeDo.workflow} className="md:col-span-2" />
                    <GlassReadOnlyField label="خروجی نهایی" value={data.projectOne.whatWeDo.finalOutput} />
                    <GlassReadOnlyField label="CTA" value={data.projectOne.whatWeDo.cta} />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 mt-8 bg-indigo-900 bg-opacity-40 p-2 rounded">۳. توانمندی‌های انحصاری</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassReadOnlyField label="مدت زمان" value={data.projectOne.exclusive.duration} />
                    <GlassReadOnlyField label="مود" value={data.projectOne.exclusive.mood} />
                    <GlassReadOnlyField label="اجازه مقایسه؟" value={data.projectOne.exclusive.allowComparisons ? "بله" : "خیر"} />
                    <GlassReadOnlyField label="توانایی‌های خاص" value={data.projectOne.exclusive.uniqueCapabilities} className="md:col-span-2" />
                    <GlassReadOnlyField label="Secret Sauce" value={data.projectOne.exclusive.secretSauce} />
                    <GlassReadOnlyField label="سناریو مقایسه" value={data.projectOne.exclusive.comparisonScenario} />
                    <GlassReadOnlyField label="تصویرسازی انتزاعی" value={data.projectOne.exclusive.abstractImagery} />
                    <GlassReadOnlyField label="کلمات تخصصی" value={data.projectOne.exclusive.technicalTerms} />
                    <GlassReadOnlyField label="CTA" value={data.projectOne.exclusive.cta} />
                </div>
            </GlassCard>
        </section>

        {/* Project 2 */}
        <section className="relative">
            <div className="absolute -right-4 top-0 bottom-0 w-1 bg-purple-500 rounded-full"></div>
            <GlassCard>
                <h2 className="text-2xl font-bold text-purple-400 mb-6 border-b border-white border-opacity-10 pb-4 flex items-center">
                    <FileText className="ml-3" /> پروژه دوم: سریال چالش‌ها
                </h2>
                <div className="space-y-6">
                    {data.projectTwo.map((row, i) => (
                        <div key={row.id} className="bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-5">
                            <h4 className="text-lg font-bold text-purple-300 mb-3">اپیزود {i + 1}: {row.name || 'بدون عنوان'}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <GlassReadOnlyField label="مشکل" value={row.problem} />
                                <GlassReadOnlyField label="استراتژی" value={row.strategy} />
                                <GlassReadOnlyField label="نتیجه" value={row.result} />
                                <GlassReadOnlyField label="تصویرسازی" value={row.visualProblem} />
                                <GlassReadOnlyField label="اجرا" value={row.execution} />
                                <GlassReadOnlyField label="شعار/CTA" value={`${row.slogan} / ${row.cta}`} />
                            </div>
                        </div>
                    ))}
                    {data.projectTwo.length === 0 && <p className="text-gray-500 italic">اطلاعاتی وارد نشده است.</p>}
                </div>
            </GlassCard>
        </section>

        {/* Project 3 */}
         <section className="relative">
            <div className="absolute -right-4 top-0 bottom-0 w-1 bg-emerald-500 rounded-full"></div>
            <GlassCard>
                <h2 className="text-2xl font-bold text-emerald-400 mb-6 border-b border-white border-opacity-10 pb-4 flex items-center">
                    <FileText className="ml-3" /> پروژه سوم: آیکون‌های متحرک
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm text-gray-300">
                        <thead className="text-indigo-300 border-b border-white border-opacity-10">
                            <tr>
                                <th className="p-2">#</th>
                                <th className="p-2">عنوان</th>
                                <th className="p-2">المان‌ها</th>
                                <th className="p-2">نوع حرکت</th>
                                <th className="p-2">لینک</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.projectThree.map((row, i) => (
                                <tr key={row.id} className="border-b border-white border-opacity-5">
                                    <td className="p-2">{i+1}</td>
                                    <td className="p-2 font-bold text-white">{row.title}<br/><span className="text-xs font-normal text-gray-500">{row.contextText}</span></td>
                                    <td className="p-2">{row.elements}</td>
                                    <td className="p-2">{row.actionType === 'loop' ? 'لوپ' : 'یک‌بار'}</td>
                                    <td className="p-2">{row.link}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.projectThree.length === 0 && <p className="text-gray-500 italic p-4">اطلاعاتی وارد نشده است.</p>}
                </div>
            </GlassCard>
        </section>

      </motion.div>
    </div>
  );
};

export default AdminDashboard;
