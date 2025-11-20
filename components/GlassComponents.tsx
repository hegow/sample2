import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface GlassProps extends HTMLMotionProps<"div"> {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const GlassCard: React.FC<GlassProps> = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 shadow-xl rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export const GlassInput: React.FC<InputProps> = ({ label, helperText, className = '', ...props }) => (
  <div className="mb-4 w-full">
    <label className="block text-sm font-bold text-indigo-200 mb-1">{label}</label>
    {helperText && <p className="text-xs text-gray-400 mb-2">{helperText}</p>}
    <input
      className={`w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-opacity-10 transition-all ${className}`}
      {...props}
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
}

export const GlassTextArea: React.FC<TextAreaProps> = ({ label, helperText, className = '', ...props }) => (
  <div className="mb-4 w-full">
    <label className="block text-sm font-bold text-indigo-200 mb-1">{label}</label>
    {helperText && <p className="text-xs text-gray-400 mb-2">{helperText}</p>}
    <textarea
      rows={4}
      className={`w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-opacity-10 transition-all resize-y ${className}`}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const GlassSelect: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="mb-4 w-full">
    <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
    <div className="relative">
      <select
        className={`w-full appearance-none bg-gray-900 bg-opacity-60 border border-white border-opacity-10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success';
  loading?: boolean;
}

export const GlassButton: React.FC<ButtonProps> = ({ children, variant = 'primary', loading, className = '', ...props }) => {
  const colors = {
    primary: 'bg-indigo-600 hover:bg-indigo-500',
    danger: 'bg-red-600 hover:bg-red-500',
    success: 'bg-emerald-600 hover:bg-emerald-500'
  };

  return (
    <button
      disabled={loading}
      className={`${colors[variant]} text-white font-bold py-2 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          در حال پردازش...
        </span>
      ) : children}
    </button>
  );
};

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface GlassRadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export const GlassRadioGroup: React.FC<GlassRadioGroupProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-6 w-full">
      <label className="block text-sm font-bold text-indigo-200 mb-3">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer relative p-4 rounded-xl border transition-all duration-200 flex items-start ${
              value === option.value
                ? 'bg-indigo-600 bg-opacity-40 border-indigo-400 shadow-lg'
                : 'bg-white bg-opacity-5 border-white border-opacity-10 hover:bg-opacity-10'
            }`}
          >
            <div className={`mt-1 ml-3 flex-shrink-0 ${value === option.value ? 'text-indigo-300' : 'text-gray-500'}`}>
               {value === option.value ? <CheckCircle size={20} /> : <Circle size={20} />}
            </div>
            <div>
              <h4 className={`font-bold text-sm ${value === option.value ? 'text-white' : 'text-gray-300'}`}>
                {option.label}
              </h4>
              {option.description && (
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GlassProgressBar: React.FC<{ progress: number, className?: string }> = ({ progress, className = '' }) => (
  <div className={`w-full bg-gray-700 bg-opacity-50 rounded-full h-2 overflow-hidden ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5 }}
      className={`h-full rounded-full ${
        progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
      }`}
    />
  </div>
);

export const GlassReadOnlyField: React.FC<{ label: string, value: string, className?: string }> = ({ label, value, className = '' }) => (
  <div className={`mb-4 p-4 bg-black bg-opacity-20 rounded-lg border border-white border-opacity-5 ${className}`}>
    <span className="block text-xs font-bold text-indigo-300 mb-1">{label}</span>
    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
      {value || <span className="text-gray-600 italic">تکمیل نشده</span>}
    </p>
  </div>
);